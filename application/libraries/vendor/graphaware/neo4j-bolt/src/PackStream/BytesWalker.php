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

use GraphAware\Bolt\Protocol\Message\RawMessage;

class BytesWalker
{
    /**
     * @var int
     */
    protected $position;

    /**
     * @var string
     */
    protected $bytes;

    /**
     * @var string
     */
    protected $encoding;

    /**
     * @param \GraphAware\Bolt\Protocol\Message\RawMessage $message
     * @param int                                          $position
     * @param string                                       $encoding
     */
    public function __construct(RawMessage $message, $position = 0, $encoding = 'ASCII')
    {
        $this->bytes = $message->getBytes();
        $this->position = $position;
        $this->encoding = $encoding;
    }

    /**
     * @param int $n
     *
     * @return string
     */
    public function read($n)
    {
        $n = (int) $n;
        $raw = substr($this->bytes, $this->position, $n);
        $this->position += $n;

        return $raw;
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

    public function getLength()
    {
        return mb_strlen($this->bytes, $this->encoding);
    }

    public function getPosition()
    {
        return $this->position;
    }
}