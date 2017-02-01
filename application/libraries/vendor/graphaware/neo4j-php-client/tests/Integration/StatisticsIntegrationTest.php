<?php

namespace GraphAware\Neo4j\Client\Tests\Integration;

use GraphAware\Neo4j\Client\Tests\Integration\IntegrationTestCase;

/**
 * Class StatisticsIntegrationTest
 * @package GraphAware\Neo4j\Client\Tests\Integration
 *
 * @group stats-it
 */
class StatisticsIntegrationTest extends IntegrationTestCase
{
    public function testNodesCreatedWithHttp()
    {
        $this->emptyDb();
        $result = $this->client->run('CREATE (n)', null, null, 'http');
        $summary = $result->summarize();

        $this->assertEquals(1, $summary->updateStatistics()->nodesCreated());
    }

    public function testNodesDeletedWithHttp()
    {
        $this->emptyDb();
        $this->client->run('CREATE (n)');
        $result = $this->client->run('MATCH (n) DETACH DELETE n', null, null, 'http');

        $this->assertEquals(1, $result->summarize()->updateStatistics()->nodesDeleted());
    }

    public function testRelationshipsCreatedWithHttp()
    {
        $this->emptyDb();
        $result = $this->client->run('CREATE (n)-[:REL]->(x)', null, null, 'http');

        $this->assertEquals(1, $result->summarize()->updateStatistics()->relationshipsCreated());
    }

    public function testRelationshipsDeletedWithHttp()
    {
        $this->emptyDb();
        $this->client->run('CREATE (n)-[:REL]->(x)');
        $result = $this->client->run('MATCH (n) DETACH DELETE n', null, null, 'http');

        $this->assertEquals(1, $result->summarize()->updateStatistics()->relationshipsDeleted());
    }
}