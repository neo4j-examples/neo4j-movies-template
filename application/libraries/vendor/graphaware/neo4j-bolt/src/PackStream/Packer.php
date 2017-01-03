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

use GraphAware\Bolt\Exception\BoltInvalidArgumentException;
use GraphAware\Bolt\Exception\BoltOutOfBoundsException;
use GraphAware\Bolt\Exception\SerializationException;
use GraphAware\Bolt\Protocol\Constants;

class Packer
{
    /**
     * @param $v
     * @return string
     */
    public function pack($v)
    {
        $stream = '';
        if (is_string($v)) {
            $stream .= $this->packText($v);
        } elseif (is_array($v)) {
            $stream .= ($this->isList($v) && !empty($v)) ? $this->packList($v) : $this->packMap($v);
        } elseif (is_float($v)) {
            $stream .= $this->packFloat($v);
        } elseif (is_int($v)) {
            $stream .= $this->packInteger($v);
        } elseif (is_null($v)) {
            $stream .= chr(Constants::MARKER_NULL);
        } elseif (true === $v) {
            $stream .= chr(Constants::MARKER_TRUE);
        } elseif (false === $v) {
            $stream .= chr(Constants::MARKER_FALSE);
        } elseif (is_float($v)) {
            // if it is 64 bit integers casted to float
            $r = $v + $v;
            if ('double' === gettype($r)) {
                $stream .= $this->packInteger($v);
            }
        } else {
            throw new BoltInvalidArgumentException(sprintf('Could not pack the value %s', $v));
        }

        return $stream;
    }

    /**
     * @param $length
     * @param $signature
     * @return string
     */
    public function packStructureHeader($length, $signature)
    {
        $stream = '';
        $packedSig = chr($signature);
        if ($length < Constants::SIZE_TINY) {
            $stream .= chr(Constants::STRUCTURE_TINY + $length);
            $stream .= $packedSig;
            return $stream;
        }

        if ($length < Constants::SIZE_MEDIUM) {
            $stream .= chr(Constants::STRUCTURE_MEDIUM);
            $stream .= $this->packUnsignedShortShort($length);
            $stream .= $packedSig;
            return $stream;
        }

        if ($length < Constants::SIZE_LARGE) {
            $stream .= chr(Constants::STRUCTURE_LARGE);
            $stream .= $this->packSignedShort($length);
            $stream .= $packedSig;
            return $stream;
        }

        throw new SerializationException(sprintf('Unable pack the size "%d" of the structure, Out of bound !', $length));
    }

    /**
     * @param $length
     *
     * @return string
     */
    public function getStructureMarker($length)
    {
        $length = (int) $length;
        $bytes = '';
        if ($length < Constants::SIZE_TINY) {
            $bytes .= chr(Constants::STRUCTURE_TINY + $length);
        } elseif ($length < Constants::SIZE_MEDIUM) {
            // do
        } elseif ($length < Constants::SIZE_LARGE) {
            // do
        } else {
            throw new SerializationException(sprintf('Unable to get a Structure Marker for size %d', $length));
        }

        return $bytes;
    }

    /**
     * @param array $array
     * @return string
     */
    public function packList(array $array)
    {
        $size = count($array);
        $b = $this->getListSizeMarker($size);
        foreach ($array as $k => $v) {
            $b .= $this->pack($v);
        }

        return $b;
    }

    /**
     * @param array $array
     * @return bool
     */
    public function isList(array $array)
    {
        foreach ($array as $k => $v) {
            if (!is_int($k)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param $size
     * @return string
     */
    public function getListSizeMarker($size)
    {
        $b = '';
        if ($size < Constants::SIZE_TINY) {
            $b .= chr(Constants::LIST_TINY + $size);
            return $b;
        }
        if ($size < Constants::SIZE_8) {
            $b .= chr(Constants::LIST_8);
            $b .= $this->packUnsignedShortShort($size);
            return $b;
        }
        if ($b < Constants::SIZE_16) {
            $b .= chr(Constants::LIST_16);
            $b .= $this->packUnsignedShort($size);
            return $b;
        }
        if ($b < Constants::SIZE_32) {
            $b .= chr(Constants::LIST_32);
            $b .= $this->packUnsignedLong($size);
            return $b;
        }

        throw new SerializationException(sprintf('Unable to create marker for List size %d', $size));
    }

    /**
     * @param array $array
     * @return string
     */
    public function packMap(array $array)
    {
        $size = count($array);
        $b = '';
        $b .= $this->getMapSizeMarker($size);
        foreach ($array as $k => $v) {
            $b .= $this->pack($k);
            $b .= $this->pack($v);
        }

        return $b;
    }

    /**
     * @param $v
     * @return int|string
     */
    public function packFloat($v) {
        $str = chr(Constants::MARKER_FLOAT);
        $str .= strrev(pack('d', $v));

        return $str;
    }

    /**
     * @param $size
     * @return string
     */
    public function getMapSizeMarker($size)
    {
        $b = '';
        if ($size < Constants::SIZE_TINY) {
            $b .= chr(Constants::MAP_TINY + $size);
            return $b;
        }
        if ($size < Constants::SIZE_8) {
            $b .= chr(Constants::MAP_8);
            $b .= $this->packUnsignedShortShort($size);
            return $b;
        }
        if ($size < Constants::SIZE_16) {
            $b .= chr(Constants::MAP_16);
            $b .= $this->packUnsignedShort($size);
            return $b;
        }
        if ($size < Constants::SIZE_32) {
            $b .= chr(Constants::MAP_32);
            $b .= $this->packUnsignedLong($size);
            return $b;
        }


        throw new SerializationException(sprintf('Unable to pack Array with size %d. Out of bound !', $size));
    }

    /**
     * @param $value
     * @return string
     */
    public function packText($value)
    {
        $length = strlen($value);
        $b = '';
        if ($length < 16) {
            $b .= chr(Constants::TEXT_TINY + $length);
            $b .= $value;
            return $b;
        }

        if ($length < 256) {
            $b .= chr(Constants::TEXT_8);
            $b .= $this->packUnsignedShortShort($length);
            $b .= $value;
            return $b;
        }

        if ($length < 65536) {
            $b .= chr(Constants::TEXT_16);
            $b .= $this->packUnsignedShort($length);
            $b .= $value;
            return $b;
        }

        if ($length < 2147483643) {
            $b .= chr(Constants::TEXT_32);
            $b .= $this->packUnsignedLong($length);
            $b .= $value;
            return $b;
        }

        throw new \OutOfBoundsException(sprintf('String size overflow, Max PHP String size is %d, you gave a string of size %d',
            2147483647,
            $length));
    }

    /**
     * @return string
     */
    public function getRunSignature()
    {
        return chr(Constants::SIGNATURE_RUN);
    }

    /**
     * @return string
     */
    public function getEndSignature()
    {
        return str_repeat(chr(Constants::MISC_ZERO), 2);
    }

    /**
     * @param $stream
     * @return string
     */
    public function getSizeMarker($stream)
    {
        $size = mb_strlen($stream, 'ASCII');

        return pack('n', $size);
    }

    /**
     * @param $value
     * @return string
     */
    public function packInteger($value)
    {
        $pow15 = pow(2,15);
        $pow31 = pow(2,31);
        $b = '';
        if ($value > -16 && $value < 128) {
            //$b .= chr(Constants::INT_8);
            //$b .= $this->packBigEndian($value, 2);
            $b .= $this->packSignedShortShort($value);
            return $b;
        }
        if ($value > -129 && $value < -16) {
            $b .= chr(Constants::INT_8);
            $b .= $this->packSignedShortShort($value);
            return $b;
        }
        if ($value < -16 && $value > -129) {
            $b .= chr(Constants::INT_8);
            $b .= $this->packSignedShortShort($value);
            return $b;
        }
        if ($value < -128 && $value > -32769) {
            $b .= chr(Constants::INT_16);
            $b .= $this->packBigEndian($value, 2);
            return $b;
        }
        if ($value >= -16 && $value < 128) {
            $b .= $this->packSignedShortShort($value);
            return $b;
        }
        if ($value > 127 && $value < $pow15) {
            $b .= chr(Constants::INT_16);
            $b .= pack('n', $value);
            return $b;
        }
        if ($value > 32767 && $value < $pow31) {
            $b .= chr(Constants::INT_32);
            $b .= pack('N', $value);
            return $b;
        }

        // 32 INTEGERS MINUS
        if ($value >= (-1*abs(pow(2,31))) && $value < (-1*abs(pow(2,15)))) {
            $b .= chr(Constants::INT_32);
            $b .= pack('N', $value);
            return $b;
        }

        // 64 INTEGERS POS
        if ($value >= pow(2,31) && $value < pow(2,63)) {
            $b .= chr(Constants::INT_64);
            //$b .= $this->packBigEndian($value, 8);
            $b .= pack('J', $value);
            return $b;
        }

        // 64 INTEGERS MINUS
        if ($value >= ((-1*abs(pow(2,63)))-1) && $value < (-1*abs(pow(2,31)))) {
            $b .= chr(Constants::INT_64);
            $b .= pack('J', $value);
            return $b;
        }

        throw new BoltOutOfBoundsException(sprintf('Out of bound value, max is %d and you give %d', PHP_INT_MAX, $value));
    }

    /**
     * @param $integer
     * @return string
     */
    public function packUnsignedShortShort($integer)
    {
        return pack('C', $integer);
    }

    public function packSignedShortShort($integer)
    {
        return pack('c', $integer);
    }

    /**
     * @param $integer
     * @return string
     */
    public function packSignedShort($integer)
    {
        $p = pack('s', $integer);
        $v = ord($p);

        return $v >> 32;
    }

    /**
     * @param $integer
     * @return string
     */
    public function packUnsignedShort($integer)
    {
        return pack('n', $integer);
    }

    /**
     * @param $integer
     * @return string
     */
    public function packUnsignedLong($integer)
    {
        return pack('N', $integer);
    }

    public function packUnsignedLongLong($value)
    {
        return pack('J', $value);
    }

    /**
     * @param $value
     * @return bool
     */
    public function isShortShort($value)
    {
        if (in_array($value, range(-16, 127))) {
            return true;
        }

        return false;
    }

    /**
     * @param $integer
     * @return bool
     */
    public function isShort($integer)
    {
        $min = 128;
        $max = 32767;
        $minMin = -129;
        $minMax = -32768;

        if (in_array($integer, range($min, $max)) || in_array($integer, range($minMin, $minMax))) {
            return true;
        }

        return false;
    }

    public function packBigEndian($x, $bytes)
    {
        if (($bytes <= 0) || ($bytes % 2)) {
            throw new BoltInvalidArgumentException(sprintf('Expected bytes count must be multiply of 2, %s given', $bytes));
        }
        $ox = $x;
        $isNeg = false;
        if (is_int($x)) {
            if ($x < 0) {
                $isNeg = true;
                $x = abs($x);
            }
        } else {
            throw new BoltInvalidArgumentException('Only integer values are supported');
        }
        if ($isNeg) {
            $x = bcadd($x, -1, 0);
        } //in negative domain starting point is -1, not 0
        $res = array();
        for ($b = 0; $b < $bytes; $b += 2) {
            $chnk = (int) bcmod($x, 65536);
            $x = bcdiv($x, 65536, 0);
            $res[] = pack('n', $isNeg ? ~$chnk : $chnk);
        }
        if ($x || ($isNeg && ($chnk & 0x8000))) {
            throw new BoltOutOfBoundsException(sprintf('Overflow detected while attempting to pack %s into %s bytes', $ox, $bytes));
        }
        return implode(array_reverse($res));
    }
}