<?php

namespace GraphAware\Neo4j\Client\Tests\Integration;

use GraphAware\Neo4j\Client\Stack;

/**
 * Class CombinedStatisticsIntegrationTest
 * @package GraphAware\Neo4j\Client\Tests\Integration
 *
 * @group combined-stats-it
 */
class CombinedStatisticsIntegrationTest extends IntegrationTestCase
{
    public function testContainsUpdatesIsMergedWithHttp()
    {
        $this->emptyDb();
        $stack = Stack::create(null, 'http');
        $stack->push('CREATE (n:Node)');
        $stack->push('MATCH (n) RETURN n');
        $results = $this->client->runStack($stack);

        $this->assertTrue($results->updateStatistics()->containsUpdates());
    }

    public function testStatsAreMergedWithHttp()
    {
        $this->emptyDb();
        $stack = Stack::create(null, 'http');
        $stack->push('CREATE (n:Node)');
        $stack->push('CREATE (n:Node)');
        $results = $this->client->runStack($stack);

        $this->assertEquals(2, $results->updateStatistics()->nodesCreated());
        $this->assertEquals(2, $results->updateStatistics()->labelsAdded());
    }

    public function testContainsUpdatesIsMergedWithBolt()
    {
        $this->emptyDb();
        $stack = Stack::create(null, 'bolt');
        $stack->push('CREATE (n:Node)');
        $stack->push('MATCH (n) RETURN n');
        $results = $this->client->runStack($stack);

        $this->assertTrue($results->updateStatistics()->containsUpdates());
    }

    public function testStatsAreMergedWithBolt()
    {
        $this->emptyDb();
        $stack = Stack::create(null, 'bolt');
        $stack->push('CREATE (n:Node)');
        $stack->push('CREATE (n:Node)');
        $results = $this->client->runStack($stack);

        $this->assertEquals(2, $results->updateStatistics()->nodesCreated());
        $this->assertEquals(2, $results->updateStatistics()->labelsAdded());
    }
}