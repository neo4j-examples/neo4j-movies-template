<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\PackStream;

use GraphAware\Bolt\Exception\SerializationException;
use GraphAware\Bolt\Misc\Helper;
use GraphAware\Bolt\PackStream\Structure\Structure;
use GraphAware\Bolt\Protocol\Constants;
use GraphAware\Bolt\Protocol\Message\RawMessage;

class Unpacker
{
    const SUCCESS = 'SUCCESS';

    const FAILURE = 'FAILURE';

    const RECORD = 'RECORD';

    const IGNORED = 'IGNORED';

    protected $is64bits;

    protected $streamChannel;

    public function __construct(StreamChannel $streamChannel)
    {
        $this->is64bits = PHP_INT_SIZE == 8;
        $this->streamChannel = $streamChannel;
    }

    /**
     * @param \GraphAware\Bolt\Protocol\Message\RawMessage $message
     * @return \GraphAware\Bolt\PackStream\Structure\Structure
     */
    public function unpackRaw(RawMessage $message)
    {
        $walker = new BytesWalker($message);

        return $this->unpackElement($walker);
    }

    public function unpack()
    {
        $b = '';
        do {
            $chunkHeader = $this->streamChannel->read(2);
            list(, $size) = unpack('n', $chunkHeader);
            $b .= $this->streamChannel->read($size);
        } while ($size > 0);

        return $this->unpackElement(new BytesWalker(new RawMessage($b)));
    }



    /**
     * @param \GraphAware\Bolt\PackStream\BytesWalker $walker
     * @return \GraphAware\Bolt\PackStream\Structure\Structure
     */
    public function unpackElement(BytesWalker $walker)
    {
        $marker = $walker->read(1);
        $byte = hexdec(bin2hex($marker));
        $ordMarker = ord($marker);
        $markerHigh = $ordMarker & 0xf0;
        $markerLow = $ordMarker & 0x0f;

        // Structures
        if (0xb0 <= $ordMarker && $ordMarker <= 0xbf) {
            $walker->rewind(1);
            $structureSize = $this->getStructureSize($walker);
            $sig = $this->getSignature($walker);
            $str = new Structure($sig, $structureSize);
            $done = 0;
            while ($done < $structureSize) {
                $elt = $this->unpackElement($walker);
                $str->addElement($elt);
                ++$done;
            }

            return $str;
        }

        if ($markerHigh === Constants::MAP_TINY) {
            $size = $markerLow;
            $map = [];
            for ($i = 0; $i < $size; ++$i) {
                $identifier = $this->unpackElement($walker);
                $value = $this->unpackElement($walker);
                $map[$identifier] =  $value;
            }

            return $map;
        }

        if (Constants::MAP_8 === $byte) {
            $size = $this->readUnsignedShortShort($walker);

            return $this->unpackMap($size, $walker);
        }

        if ($byte === Constants::MAP_16) {
            $size = $this->readUnsignedShort($walker);

            return $this->unpackMap($size, $walker);
        }

        if ($markerHigh === Constants::TEXT_TINY) {
            $textSize = $this->getLowNibbleValue($marker);

            return $this->unpackText($textSize, $walker);
        }

        if ($byte === Constants::TEXT_8) {
            $textSize = $this->readUnsignedShortShort($walker);

            return $this->unpackText($textSize, $walker);
        }

        if ($byte === Constants::TEXT_16) {
            $textSize = $this->readUnsignedShort($walker);

            return $this->unpackText($textSize, $walker);
        }

        if ($byte === Constants::TEXT_32) {
            $textSize = $this->readUnsignedLong($walker);

            return $this->unpackText($textSize, $walker);
        }

        if ($byte === Constants::INT_8) {
            $integer = $this->readSignedShortShort($walker);

            return $this->unpackInteger($integer);
        }

        if ($byte === Constants::INT_16) {
            $integer = $this->readSignedShort($walker);

            return $this->unpackInteger($integer);
        }

        if ($byte === Constants::INT_32) {
            $integer = $this->readSignedLong($walker);

            return $this->unpackInteger($integer);
        }

        if ($byte === Constants::INT_64) {
            $integer = $this->readSignedLongLong($walker);

            return $this->unpackInteger($integer);
        }

        if ($markerHigh === Constants::LIST_TINY) {
            $size = $this->getLowNibbleValue($marker);
            return $this->unpackList($size, $walker);
        }

        if ($byte === Constants::LIST_8) {
            $size = $this->readUnsignedShortShort($walker);

            return $this->unpackList($size, $walker);
        }

        if ($byte === Constants::LIST_16) {
            $size = $this->readUnsignedShort($walker);
            return $this->unpackList($size, $walker);
        }

        // Checks for TINY INTS
        if ($this->isInRange(0x00, 0x7f, $marker) || $this->isInRange(0xf0, 0xff, $marker)) {
            $walker->rewind(1);
            $integer = $this->readSignedShortShort($walker);

            return $this->unpackInteger($integer);
        }

        // Checks for floats
        if ($byte === Constants::MARKER_FLOAT) {

            list(, $v) = unpack('d', strrev($walker->read(8)));

            return (float) $v;
        }

        // Checks Primitive Values NULL, TRUE, FALSE
        if ($byte === Constants::MARKER_NULL) {
            return null;
        }

        if ($byte === Constants::MARKER_TRUE) {
            return true;
        }

        if ($byte === Constants::MARKER_FALSE) {
            return false;
        }

        throw new SerializationException(sprintf('Unable to find serialization type for marker %s', Helper::prettyHex($marker)));
    }

    public function unpackNode(BytesWalker $walker)
    {
        $identity = $this->unpackElement($walker);
        $labels = $this->unpackElement($walker);
        $properties = $this->unpackElement($walker);

        return new Node($identity, $labels, $properties);
    }

    public function unpackRelationship(BytesWalker $walker)
    {
        $identity = $this->unpackElement($walker);
        $startNode = $this->unpackElement($walker);
        $endNode = $this->unpackElement($walker);
        $type = $this->unpackElement($walker);
        $properties = $this->unpackElement($walker);

        return new Relationship($identity, $startNode, $endNode, $type, $properties);
    }

    public function unpackPath(BytesWalker $walker)
    {
        return $this->unpackElement($walker);
    }

    public function unpackText($size, BytesWalker $walker)
    {
        $textString = $walker->read($size);

        return $textString;
    }

    public function unpackInteger($value)
    {
        return (int) $value;
    }

    public function unpackMap($size, BytesWalker $walker)
    {
        $map = [];
        for ($i = 0; $i < $size; ++$i) {
            $identifier = $this->unpackElement($walker);
            $value = $this->unpackElement($walker);
            $map[$identifier] =  $value;
        }

        return $map;
    }

    public function unpackList($size, BytesWalker $walker)
    {
        $size = (int) $size;
        $list = [];
        for ($i = 0; $i < $size; ++$i) {
            $list[] = $this->unpackElement($walker);
        }

        return $list;
    }

    public function getStructureSize(BytesWalker $walker)
    {
        $marker = $walker->read(1);
        // if tiny size, no more bytes to read, the size is encoded in the low nibble
        if ($this->isMarkerHigh($marker, Constants::STRUCTURE_TINY)) {
            return $this->getLowNibbleValue($marker);
        }
    }

    public function getSignature(BytesWalker $walker)
    {
        static $signatures = [
            Constants::SIGNATURE_SUCCESS => self::SUCCESS,
            Constants::SIGNATURE_FAILURE => self::FAILURE,
            Constants::SIGNATURE_RECORD => self::RECORD,
            Constants::SIGNATURE_IGNORE => self::IGNORED,
            Constants::SIGNATURE_UNBOUND_RELATIONSHIP => 'UNBOUND_RELATIONSHIP',
            Constants::SIGNATURE_NODE => 'NODE',
            Constants::SIGNATURE_PATH => 'PATH',
            Constants::SIGNATURE_RELATIONSHIP => 'RELATIONSHIP'
        ];

        $sigMarker = $walker->read(1);
        $ordMarker = ord($sigMarker);

        return $signatures[$ordMarker];

        if (Constants::SIGNATURE_SUCCESS === $ordMarker) {
            return self::SUCCESS;
        }

        if ($this->isSignature(Constants::SIGNATURE_FAILURE, $sigMarker)) {
            return self::FAILURE;
        }

        if ($this->isSignature(Constants::SIGNATURE_RECORD, $sigMarker)) {
            return self::RECORD;
        }

        if ($this->isSignature(Constants::SIGNATURE_IGNORE, $sigMarker)) {
            return self::IGNORED;
        }

        if ($this->isSignature(Constants::SIGNATURE_UNBOUND_RELATIONSHIP, $sigMarker)) {
            return "UNBOUND_RELATIONSHIP";
        }

        if ($this->isSignature(Constants::SIGNATURE_NODE, $sigMarker)) {
            return "NODE";
        }

        if ($this->isSignature(Constants::SIGNATURE_PATH, $sigMarker)) {
            return "PATH";
        }

        if ($this->isSignature(Constants::SIGNATURE_RELATIONSHIP, $sigMarker)) {
            return "RELATIONSHIP";
        }

        throw new SerializationException(sprintf('Unable to guess the signature for byte "%s"', Helper::prettyHex($sigMarker)));
    }

    public function getLowNibbleValue($byte)
    {
        $marker = ord($byte);

        return $marker & 0x0f;
    }

    public function isMarker($byte, $nibble)
    {

        $marker_raw = hexdec(bin2hex($byte));

        return $marker_raw === $nibble;
    }

    public function isMarkerHigh($byte, $nibble)
    {

        $marker_raw = ord($byte);
        $marker = $marker_raw & 0xF0;

        return $marker === $nibble;
    }

    public function isSignature($sig, $byte)
    {
        $raw = ord($byte);

        return $sig === $raw;
    }

    public function readUnsignedShortShort(BytesWalker $walker)
    {
        list(, $v) = unpack('C', $walker->read(1));

        return $v;
    }

    public function readSignedShortShort(BytesWalker $walker)
    {
        list(, $v) = unpack('c', $walker->read(1));

        return $v;
    }

    public function readUnsignedShort(BytesWalker $walker)
    {
        list(, $v) = unpack('n', $walker->read(2));

        return $v;
    }

    public function readSignedShort(BytesWalker $walker)
    {
        list(, $v) = unpack('s', $this->correctEndianness($walker->read(2)));

        return $v;
    }

    public function readUnsignedLong(BytesWalker $walker)
    {
        list(, $v) = unpack('N', $walker->read(4));

        return sprintf('%u', $v);
    }

    public function readSignedLong(BytesWalker $walker)
    {
        list(, $v) = unpack('l', $this->correctEndianness($walker->read(4)));

        return $v;
    }

    public function readUnsignedLongLong(BytesWalker $walker)
    {
        list(, $v) = unpack('J', $walker->read(8));

        return $v;
    }

    public function readSignedLongLong(BytesWalker $walker)
    {
        list(, $high, $low) = unpack('N2', $walker->read(8));

        return (int) bcadd($high << 32, $low, 0);
    }

    public function isInRange($start, $end, $byte)
    {
        $range = range($start, $end);

        return in_array(ord($byte), $range);
    }

    public function read_longlong(BytesWalker $walker)
    {
        $this->bitcount = $this->bits = 0;
        list(, $hi, $lo) = unpack('N2', $walker->read(8));
        $msb = self::getLongMSB($hi);
        if (!$this->is64bits) {
            if ($msb) {
                $hi = sprintf('%u', $hi);
            }
            if (self::getLongMSB($lo)) {
                $lo = sprintf('%u', $lo);
            }
        }
        return bcadd($this->is64bits && !$msb ? $hi << 32 : bcmul($hi, '4294967296', 0), $lo, 0);
    }

    private function correctEndianness($byteString)
    {
        $tmp = unpack('S', "\x01\x00");
        $isLittleEndian = $tmp[1] == 1;

        return $isLittleEndian ? strrev($byteString) : $byteString;
    }

    private static function getLongMSB($longInt)
    {
        return (bool) ($longInt & 0x80000000);
    }
}