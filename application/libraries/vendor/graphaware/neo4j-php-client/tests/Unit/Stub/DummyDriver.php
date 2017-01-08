<?php

namespace GraphAware\Neo4j\Client\Tests\Unit\Stub;

use GraphAware\Common\Driver\DriverInterface;

class DummyDriver implements DriverInterface
{
    protected $uri;

    public function __construct($uri)
    {
        $this->uri = $uri;
    }

    /**
     * @return mixed
     */
    public function getUri()
    {
        return $this->uri;
    }

    public function session()
    {

    }

}