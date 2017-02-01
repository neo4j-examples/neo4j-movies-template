<?php

namespace GraphAware\Neo4j\Client\Tests\Unit\Connection;

use GraphAware\Neo4j\Client\Connection\Connection;
use GraphAware\Neo4j\Client\HttpDriver\Driver as HttpDriver;

/**
 * @group unit
 * @group connection
 */
class ConnectionUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testConnectionInstantiation()
    {
        $connection = new Connection('default', 'http://localhost:7474', null, 5);
        $this->assertInstanceOf(HttpDriver::class, $connection->getDriver());
    }
}