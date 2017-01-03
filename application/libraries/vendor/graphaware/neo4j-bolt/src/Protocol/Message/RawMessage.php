<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Protocol\Message;

class RawMessage
{
    protected $bytes = '';

    public function __construct($bytes)
    {
        $this->bytes = $bytes;
    }

    public function getLength()
    {
        return mb_strlen($this->bytes, 'ASCII');
    }

    public function getBytes()
    {
        return $this->bytes;
    }
}