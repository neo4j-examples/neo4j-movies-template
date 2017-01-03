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

use GraphAware\Bolt\Misc\Helper;
use GraphAware\Bolt\Protocol\Message\RawMessage;

class StreamChannel
{
    const ENCODING = 'ASCII';

    /**
     * @var int
     */
    protected $position = 0;

    /**
     * @var string
     */
    protected $bytes;

    /**
     * @var int
     */
    protected $length = 0;

    /**
     * @var \GraphAware\Bolt\IO\AbstractIO
     */
    protected $io;

    protected $t = 0;

    /**
     * BytesWalker constructor.
     * @param \GraphAware\Bolt\IO\AbstractIO $io
     */
    public function __construct($io)
    {
        if ($io instanceof RawMessage) {
            $this->bytes = $io->getBytes();
            $this->length = strlen($this->bytes);
        } else {
            $this->io = $io;
            //$this->io->assumeNonBlocking();
        }
    }

    /**
     * @param int $n
     *
     * @return string
     */
    public function read($n)
    {
        if (0 === $n) {
            return '';
        }
        $remaining = ($n - $this->length) + $this->position;
        while ($remaining > 0) {
            //$this->io->wait();
            $new = $this->io->readChunk();
            $this->bytes .= $new;
            $remaining -= strlen($new);
            ++$this->t;
        }
        $this->length = strlen($this->bytes);
        $data = substr($this->bytes, $this->position, $n);
        $this->position += $n;

        return $data;
    }

    public function forward($n)
    {
        $n = (int) $n;
        if (($this->position + $n) > $this->getLength()) {
            throw new \OutOfBoundsException(sprintf('No more bytes to read'));
        }

        $this->position += $n;
    }

    public function setPosition($n)
    {
        $n = (int) $n;
        if ($n > $this->getLength()) {
            throw new \OutOfBoundsException(sprintf('Require position out of bound'));
        }

        $this->position = $n;
    }

    /**
     * @param int $n
     */
    public function rewind($n)
    {
        $n = (int) $n;
        if ($n > $this->position) {
            throw new \InvalidArgumentException(sprintf('You try to rewind %d characters, but current position is %d',
                $n,
                $this->position
            ));
        }

        $this->position -= $n;
    }

    public function getPosition()
    {
        return $this->position;
    }
}