<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\Tests\Integration;

use GraphAware\Neo4j\Client\Client;
use GraphAware\Neo4j\Client\ClientBuilder;
use GraphAware\Neo4j\Client\Connection\Connection;
use GraphAware\Neo4j\Client\HttpDriver\Driver as HttpDriver;
use GraphAware\Bolt\Driver as BoltDriver;
use \InvalidArgumentException;
use GraphAware\Neo4j\Client\Connection\ConnectionManager;
use Prophecy\Prophet;

/**
 * Class ClientSetupIntegrationTest
 * @package GraphAware\Neo4j\Client\Tests\Integration
 *
 * @group setup
 */
class ClientSetupIntegrationTest extends \PHPUnit_Framework_TestCase
{
    public function testClientSetupWithOneConnection()
    {
        $client = ClientBuilder::create()
            ->addConnection('default', 'bolt://localhost')
            ->build();

        $this->assertInstanceOf(Client::class, $client);
    }

    public function testHttpDriverIsUsedForConnection()
    {
        $client = ClientBuilder::create()
            ->addConnection('default', 'http://localhost:7474')
            ->build();

        $connection = $client->getConnectionManager()->getConnection('default');
        $this->assertInstanceOf(HttpDriver::class, $connection->getDriver());
    }

    public function testBoltDriverIsUsedForConnection()
    {
        $client = ClientBuilder::create()
            ->addConnection('default', 'bolt://localhost')
            ->build();

        $connection = $client->getConnectionManager()->getConnection('default');
        $this->assertInstanceOf(BoltDriver::class, $connection->getDriver());
    }

    public function testTwoConnectionCanBeUsed()
    {
        $client = ClientBuilder::create()
            ->addConnection('http', 'http://localhost:7474')
            ->addConnection('bolt', 'bolt://localhost')
            ->build();

        $this->assertInstanceOf(HttpDriver::class, $client->getConnectionManager()->getConnection('http')->getDriver());
        $this->assertInstanceOf(BoltDriver::class, $client->getConnectionManager()->getConnection('bolt')->getDriver());
    }

    public function testNullIseReturnedForMasterWhenNoMasterIsDefined()
    {
        $client = ClientBuilder::create()
            ->addConnection('default', 'http://localhost:7474')
            ->addConnection('conn2', 'http://localhost:7575')
            ->addConnection('conn3', 'http://localhost:7676')
            ->build();

        $this->assertNull($client->getConnectionManager()->getMasterConnection());
    }

   public function testICanDefineConnectionAsWriteOrRead()
   {
       $client = ClientBuilder::create()
           ->addConnection('default', 'http://localhost:7474')
           ->addConnection('conn2', 'http://localhost:7575')
           ->addConnection('conn3', 'http://localhost:7676')
           ->setMaster('conn2')
           ->build();

       $this->assertEquals('conn2', $client->getConnectionManager()->getMasterConnection()->getAlias());
   }

    public function testSecondIsMasterCallOverridesPreviousOne()
    {
        $client = ClientBuilder::create()
            ->addConnection('default', 'http://localhost:7474')
            ->addConnection('conn2', 'http://localhost:7575')
            ->addConnection('conn3', 'http://localhost:7676')
            ->setMaster('conn2')
            ->setMaster('default')
            ->build();

        $this->assertEquals('default', $client->getConnectionManager()->getMasterConnection()->getAlias());
    }

    public function testExceptionIsThrownWhenMasterAliasDoesntExist()
    {
        $this->setExpectedException(InvalidArgumentException::class);
        $client = ClientBuilder::create()
            ->addConnection('default', 'http://localhost:7474')
            ->addConnection('conn2', 'http://localhost:7575')
            ->addConnection('conn3', 'http://localhost:7676')
            ->setMaster('conn5')
            ->build();
    }

    public function testSendWriteUseMasterIfAvailable()
    {
        $connectionManager = $this->prophesize(ConnectionManager::class);
        $conn = new Connection('default', 'http://localhost:7474', null, 5);
        $connectionManager->getMasterConnection()->willReturn($conn);
        $connectionManager->getMasterConnection()->shouldBeCalled();

        $client = new Client($connectionManager->reveal());
        $client->runWrite('MATCH (n) RETURN count(n)');
    }
}