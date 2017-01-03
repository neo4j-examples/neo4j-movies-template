<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\IO;

interface IoInterface
{
    public function write($data);

    public function read($n);

    public function select($sec, $usec);

    public function connect();

    public function reconnect();

    public function isConnected();

    public function close();
}