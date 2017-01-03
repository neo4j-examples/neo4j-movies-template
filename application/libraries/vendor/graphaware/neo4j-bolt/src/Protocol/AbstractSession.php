<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) GraphAware Ltd <christophe@graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Protocol;

use GraphAware\Bolt\IO\AbstractIO;
use GraphAware\Bolt\PackStream\Serializer;
use GraphAware\Bolt\PackStream\StreamChannel;
use GraphAware\Bolt\PackStream\Unpacker;
use GraphAware\Bolt\PackStream\Packer;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

abstract class AbstractSession implements SessionInterface
{
    protected $io;

    protected $dispatcher;

    protected $serializer;

    protected $packer;

    protected $unpacker;

    protected $writer;

    protected $streamChannel;

    public function __construct(AbstractIO $io, EventDispatcherInterface $dispatcher)
    {
        $this->io = $io;
        $this->dispatcher = $dispatcher;
        $this->packer = new Packer();
        $this->streamChannel = new StreamChannel($io);
        $this->unpacker = new Unpacker($this->streamChannel);
        $this->serializer = new Serializer($this->packer, $this->unpacker);
        $this->writer = new ChunkWriter($this->io, $this->packer);
    }

    public function getSerializer()
    {
        return $this->serializer;
    }

    public function getWriter()
    {
        return $this->writer;
    }
}