<?php

namespace GraphAware\Neo4j\Client\Tests\Integration;

use GraphAware\Common\Type\Node;
use GraphAware\Bolt\Result\Type\Node as BoltNode;
use GraphAware\Neo4j\Client\Formatter\Type\Node as HttpNode;
use GraphAware\Neo4j\Client\Formatter\Type\Relationship as HttpRelationship;
use GraphAware\Bolt\Result\Type\Relationship as BoltRelationship;
use GraphAware\Common\Type\PathInterface;

class CypherIntegrationTest extends IntegrationTestCase
{
    public function setUp()
    {
        parent::setUp();
        $this->emptyDb();
    }

    public function testNodeIsReturned()
    {
        $query = 'CREATE (n:Node) RETURN n';
        $record1 = $this->client->run($query, [], null, 'http')->firstRecord();
        $this->assertInstanceOf(Node::class, $record1->get('n'));
        $this->assertInstanceOf(HttpNode::class, $record1->get('n'));
        $record2 = $this->client->run($query, [], null, 'bolt')->firstRecord();
        $this->assertInstanceOf(Node::class, $record2->get('n'));
        $this->assertInstanceOf(BoltNode::class, $record2->get('n'));
    }

    public function testRelationshipIsReturned()
    {
        $query = 'CREATE (a)-[r:RELATES]->(b) RETURN a, r, b';
        $record1 = $this->client->run($query, [], null, 'http')->firstRecord();
        $record2 = $this->client->run($query, [], null, 'bolt')->firstRecord();
        $this->assertInstanceOf(HttpRelationship::class, $record1->get('r'));
        $this->assertInstanceOf(BoltRelationship::class, $record2->get('r'));
    }

    /**
     * @group path
     */
    public function testPathIsReturned()
    {
        $query = 'CREATE p=(a:Cool)-[:RELATES]->(b:NotSoCool) RETURN p';
        $record1 = $this->client->run($query, [], null, 'http')->firstRecord();
        $record2 = $this->client->run($query, [], null, 'bolt')->firstRecord();
        $this->assertInstanceOf(PathInterface::class, $record1->get('p'));
        $this->assertInstanceOf(PathInterface::class, $record2->get('p'));
    }
}