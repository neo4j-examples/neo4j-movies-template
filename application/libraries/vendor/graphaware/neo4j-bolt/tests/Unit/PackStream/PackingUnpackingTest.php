<?php

namespace GraphAware\Bolt\Tests\Unit\PackSream;

use GraphAware\Bolt\IO\StreamSocket;
use GraphAware\Bolt\PackStream\BytesWalker;
use GraphAware\Bolt\PackStream\StreamChannel;
use GraphAware\Bolt\PackStream\Structure\SimpleElement;
use GraphAware\Bolt\PackStream\Structure\TextElement;
use GraphAware\Bolt\PackStream\Unpacker;
use GraphAware\Bolt\Protocol\Constants;
use GraphAware\Bolt\Protocol\Message\RawMessage;
use GraphAware\Bolt\PackStream\Packer;

/**
 * Class UnpackerTest
 * @package GraphAware\Bolt\Tests\Unit\PackSream
 *
 * @group unit
 * @group unpack
 */
class UnpackerTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \GraphAware\Bolt\PackStream\Unpacker
     */
    protected $unpacker;

    /**
     * @var \GraphAware\Bolt\PackStream\Packer
     */
    protected $packer;

    public function setUp()
    {
        $this->unpacker = new Unpacker(new StreamChannel(new StreamSocket("bolt://localhost", 7687)));
        $this->packer = new Packer();
    }

    public function testPackingNull()
    {
        $w = $this->getWalkerForBinary(chr(Constants::MARKER_NULL));
        $nullElement = null;
        $this->assertEquals($nullElement, $this->unpacker->unpackElement($w));
        $this->assertEquals(chr(Constants::MARKER_NULL), $this->packer->pack(null));
    }

    public function testPackingTrue()
    {
        $w = $this->getWalkerForBinary(chr(Constants::MARKER_TRUE));
        $trueElt = true;
        $this->assertEquals($trueElt, $this->unpacker->unpackElement($w));
        $this->assertEquals(chr(Constants::MARKER_TRUE), $this->packer->pack(true));
    }

    public function testPackingFalse()
    {
        $w = $this->getWalkerForBinary(chr(Constants::MARKER_FALSE));
        $elt = false;
        $this->assertEquals($elt, $this->unpacker->unpackElement($w));
        $this->assertEquals(chr(Constants::MARKER_FALSE), $this->packer->pack(false));
    }

    public function testPackingTinyText()
    {
        $text = 'TinyText';
        $length = strlen($text);
        $binary = chr(Constants::TEXT_TINY + $length) . $text;
        $w = $this->getWalkerForBinary($binary);
        $elt = $text;
        $this->assertEquals($elt, $this->unpacker->unpackElement($w));
        $this->assertEquals($binary, $this->packer->pack($text));
    }

    public function testPackingText8()
    {
        $text = str_repeat('a', (Constants::SIZE_8)-1);
        $length = strlen($text);
        $binary = chr(Constants::TEXT_8) . $this->packer->packUnsignedShortShort($length) . $text;
        $w = $this->getWalkerForBinary($binary);
        $this->assertEquals($text, $this->unpacker->unpackElement($w));
        $this->assertEquals($binary, $this->packer->pack($text));
    }

    public function testPackingText16()
    {
        $text = str_repeat("a", (Constants::SIZE_16)-1);
        $length = strlen($text);
        $bin = chr(Constants::TEXT_16) . $this->packer->packUnsignedShort($length) . $text;
        $w = $this->getWalkerForBinary($bin);
        $this->assertEquals($text, $this->unpacker->unpackElement($w));
        $this->assertEquals($bin, $this->packer->pack($text));
    }

    /**
     * @group sig
     */
    public function testGetSignature()
    {
        $bytes = hex2bin("b170a0");
        $raw = new RawMessage($bytes);
        $walker = new BytesWalker($raw);
        //$walker->forward(1);

        //$sig = $this->unpacker->getSignature($walker);
        //$this->assertEquals('SUCCESS', $sig);
    }

    public function getWalkerForBinary($binary = '', $pos = 0)
    {
        $raw = new RawMessage($binary);
        return new BytesWalker($raw, $pos);
    }
}