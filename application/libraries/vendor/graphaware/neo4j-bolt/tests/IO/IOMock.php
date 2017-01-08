<?php

namespace GraphAware\Bolt\Tests\IO;

use GraphAware\Bolt\IO\AbstractIO;

class IOMock extends AbstractIO
{
    protected $messages;

    public function __construct($host = null, $port = null)
    {
        $this->messages = '';
    }

    public function write($data)
    {
        // TODO: Implement write() method.
    }

    public function read($n)
    {
        // TODO: Implement read() method.
    }

    public function select($sec, $usec)
    {
        // TODO: Implement select() method.
    }

    public function connect()
    {
        // TODO: Implement connect() method.
    }

    public function reconnect()
    {
        // TODO: Implement reconnect() method.
    }

    public function isConnected()
    {
        // TODO: Implement isConnected() method.
    }

    public function close()
    {
        // TODO: Implement close() method.
    }


}

