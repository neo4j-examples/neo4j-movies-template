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

use GraphAware\Bolt\Exception\IOException;
use Symfony\Component\Console\Helper\Helper;
use Symfony\Component\EventDispatcher\EventDispatcher;

class StreamSocket extends AbstractIO
{
    protected $protocol;

    protected $host;

    protected $port;

    protected $context;

    protected $keepAlive;

    protected $eventDispatcher;

    protected $timeout = 5;

    private $sock;

    public function __construct($host, $port, $context = null, $keepAlive = false, EventDispatcher $eventDispatcher = null)
    {
        $this->host = $host;
        $this->port = $port;
        $this->context = $context;
        $this->keepAlive = $keepAlive;
        $this->eventDispatcher = $eventDispatcher;
        $this->protocol = 'tcp';
        if (is_null($this->context)) {
            $this->context = stream_context_create();
        } else {
            $this->protocol = 'ssl';
        }
        //stream_set_blocking($this->sock, false);
    }

    public function write($data)
    {
        //echo \GraphAware\Bolt\Misc\Helper::prettyHex($data) . PHP_EOL;
        $this->assertConnected();
        $written = 0;
        $len = mb_strlen($data, 'ASCII');

        while ($written < $len) {
            $buf = fwrite($this->sock, $data);

            if ($buf === false) {
                throw new IOException('Error writing data');
            }

            if ($buf === 0 && feof($this->sock)) {
                throw new IOException('Broken pipe or closed connection');
            }

            $written += $buf;
        }
    }

    public function read($n)
    {
        if (null === $n) {
            return $this->readAll();
        }
        $this->assertConnected();
        $read = 0;
        $data = '';

        while ($read < $n) {
            $buffer = fread($this->sock, ($n - $read));
            //var_dump(\GraphAware\Bolt\Misc\Helper::prettyHex($buffer));
            // check '' later for non-blocking mode use case
            if ($buffer === false || '' === $buffer) {
                throw new IOException('Error receiving data');
            }

            $read += mb_strlen($buffer, 'ASCII');
            $data .= $buffer;
        }

        return $data;
    }

    public function readAll()
    {
        stream_set_blocking($this->sock, false);
        $r = array($this->sock);
        $w = $e = [];
        $data = '';
        $continue = true;

        while ($continue) {
            $select = stream_select($r, $w, $e, 0, 10000);
            if (0 === $select) {
                stream_set_blocking($this->sock, true);
                return $data;
            }
            $buffer = stream_get_contents($this->sock, 8192);
            if ($buffer === '') {
                stream_select($r, $w, $e, null, null);
            }
            $r = array($this->sock);
            $data .= $buffer;
        }
    }

    public function readChunk($l = 8192)
    {
        $buffer = stream_socket_recvfrom($this->sock, $l);

        return $buffer;
    }

    public function assumeNonBlocking()
    {
        stream_set_blocking($this->sock, false);
    }

    public function wait()
    {
        do {
            $result = $this->select(0,0);
        } while ($result === 0);
    }

    public function select($sec, $usec)
    {
        $r = array($this->sock);
        $w = $e = null;
        $result = stream_select($r, $w, $e, $sec, $usec);

        return $result;
    }

    public function connect()
    {
        $errstr = $errno = null;

        $remote = sprintf(
            '%s://%s:%s',
            $this->protocol,
            $this->host,
            $this->port
        );

        $this->sock = stream_socket_client(
            $remote,
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $this->context
        );

        if (false === $this->sock) {
            throw new IOException(sprintf(
                'Error to connect to the server(%s) :  "%s"', $errno, $errstr
            ));
        }

        stream_set_read_buffer($this->sock, 0);
    }

    public function close()
    {
        if (is_resource($this->sock)) {
            fclose($this->sock);
        }
        $this->sock = null;
    }

    public function reconnect()
    {
        $this->close();
        $this->connect();
    }

    public function assertConnected()
    {
        if (!$this->isConnected()) {
            $this->connect();
        }
    }

    public function isConnected()
    {
        return null !== $this->sock && false !== $this->sock;
    }

}