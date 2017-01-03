<?php

namespace GraphAware\Neo4j\Client\Tests\Integration;

use GraphAware\Neo4j\Client\ClientBuilder;
use GraphAware\Neo4j\Client\Neo4jClientEvents;
use GraphAware\Neo4j\Client\Exception\Neo4jExceptionInterface;

/**
 * Class BuildWithEventListenersIntegrationTest
 * @package GraphAware\Neo4j\Client\Tests\Integration
 *
 * @group listener
 */
class BuildWithEventListenersIntegrationTest extends \PHPUnit_Framework_TestCase
{
    public function testListenersAreRegistered()
    {
        $listener = new EventListener();
        $client = ClientBuilder::create()
            ->addConnection('default', 'bolt://localhost')
            ->registerEventListener(Neo4jClientEvents::NEO4J_PRE_RUN, array($listener, 'onPreRun'))
            ->registerEventListener(Neo4jClientEvents::NEO4J_POST_RUN, array($listener, 'onPostRun'))
            ->registerEventListener(Neo4jClientEvents::NEO4J_ON_FAILURE, array($listener, 'onFailure'))
            ->build();

        $result = $client->run('MATCH (n) RETURN count(n)');
        $this->assertTrue($listener->hookedPreRun);
        $this->assertTrue($listener->hookedPostRun);
    }

    public function testFailureCanBeDisabled()
    {
        $listener = new EventListener();
        $client = ClientBuilder::create()
            ->addConnection('default', 'bolt://localhost')
            ->registerEventListener(Neo4jClientEvents::NEO4J_ON_FAILURE, array($listener, 'onFailure'))
            ->build();

        $client->run('MATCH (n)');
        $this->assertInstanceOf(Neo4jExceptionInterface::class, $listener->e);
    }
}