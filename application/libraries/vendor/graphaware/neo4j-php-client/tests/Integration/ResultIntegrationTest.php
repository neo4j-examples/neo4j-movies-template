<?php

namespace GraphAware\Neo4j\Client\Tests\Integration;

use GraphAware\Common\Type\Node;
use GraphAware\Common\Type\Relationship;
use \InvalidArgumentException;

/**
 * Class ResultIntegrationTest
 * @package GraphAware\Neo4j\Client\Tests\Integration
 *
 * @group result-it
 */
class ResultIntegrationTest extends IntegrationTestCase
{
    public function testRecordReturnsNodeValue()
    {
        $this->emptyDb();
        $result = $this->client->run('CREATE (n) RETURN n');
        $record = $result->firstRecord();

        $this->assertInstanceOf(Node::class, $record->nodeValue('n'));
    }

    public function testRecordRelationshipValue()
    {
        $this->emptyDb();
        $result = $this->client->run('CREATE (n)-[r:KNOWS]->(x) RETURN n, r');
        $record = $result->firstRecord();

        $this->assertInstanceOf(Relationship::class, $record->get('r'));
    }

    public function testExceptionIsThrownForInvalidNodeValue()
    {
        $this->emptyDb();
        $result = $this->client->run('CREATE (n) RETURN id(n) as id');
        $record = $result->firstRecord();

        $this->setExpectedException(InvalidArgumentException::class);
        $record->nodeValue('id');
    }

    public function testExceptionIsThrownForInvalidRelationshipValue()
    {
        $this->emptyDb();
        $result = $this->client->run('CREATE (n)-[r:KNOWS]->(me) RETURN id(r) as r');
        $record = $result->firstRecord();

        $this->setExpectedException(InvalidArgumentException::class);
        $record->relationshipValue('r');
    }
}