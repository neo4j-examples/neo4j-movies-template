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
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class Socket extends AbstractIO
{
    private $host;

    private $port;

    private $socket;

    private $timeout;

    protected $dispatcher;

    public function __construct($host, $port, $timeout = 5, EventDispatcherInterface $dispatcher = null)
    {
        $this->host = $host;
        $this->port = $port;
        $this->timeout = $timeout;
        $this->dispatcher = $dispatcher;
    }

    public function connect()
    {
        $this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        if (!socket_connect($this->socket, $this->host, $this->port)) {
            $errno = socket_last_error($this->socket);
            $errstr = socket_strerror($errno);
            throw new IOException(
                sprintf('Error connecting to server "%s": %s',
                    $errno,
                    $errstr
                ), $errno
            );
        }

        socket_set_block($this->socket);
        socket_set_option($this->socket, SOL_TCP, TCP_NODELAY, 1);
        //socket_set_option($this->socket, SOL_SOCKET, SO_PASSCRED
        socket_set_option($this->socket, SOL_SOCKET, SO_KEEPALIVE, 1);
        socket_set_option($this->socket, SOL_SOCKET, SO_RCVTIMEO, array('sec' => $this->timeout, 'usec' => 0));
        socket_set_option($this->socket, SOL_SOCKET, SO_SNDTIMEO, array('sec' => $this->timeout, 'usec' => 0));

        return true;
    }

    public function close()
    {
        if (is_resource($this->socket)) {
            echo 'closing';
            socket_close($this->socket);
        }
        $this->socket = null;

        return true;
    }

    public function reconnect()
    {
        $this->close();
        $this->connect();
    }

    public function getSocket()
    {
        return $this->socket;
    }

    public function write($data)
    {
        $len = mb_strlen($data, 'ASCII');

        while (true) {
            // Null sockets are invalid, throw exception
            if (is_null($this->socket)) {
                throw new IOException(sprintf(
                    'Socket was null! Last SocketError was: %s',
                    socket_strerror(socket_last_error())
                ));
            }

            $sent = socket_write($this->socket, $data, $len);
            if ($sent === false) {

                throw new IOException(sprintf(
                    'Error sending data. Last SocketError: %s',
                    socket_strerror(socket_last_error())
                ));
            }

            // Check if the entire message has been sent
            if ($sent < $len) {
                // If not sent the entire message.
                // Get the part of the message that has not yet been sent as message
                $data = mb_substr($data, $sent, mb_strlen($data, 'ASCII') - $sent, 'ASCII');
                // Get the length of the not sent part
                $len -= $sent;
            } else {
                break;
            }
        }
    }

    public function select($sec, $usec)
    {
        // not implemented yet
    }

    public function read($n)
    {
        $res = '';
        $read = 0;

        $buf = socket_read($this->socket, $n);
        while ($read < $n && $buf !== '' && $buf !== false) {
            $read += mb_strlen($buf, 'ASCII');
            $res .= $buf;
            $buf = socket_read($this->socket, $n - $read);
        }

        if (mb_strlen($res, 'ASCII') != $n) {
            throw new IOException(sprintf(
                'Error reading data. Received %s instead of expected %s bytes',
                mb_strlen($res, 'ASCII'),
                $n
            ));
        }
        return $res;
    }

    public function isConnected()
    {
        return is_resource($this->socket);
    }

    public function assertConnected()
    {
        if (!$this->isConnected()) {
            $this->connect();
        }
    }
}