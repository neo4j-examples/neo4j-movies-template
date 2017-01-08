<?php

namespace GraphAware\Bolt\Tests\Integration\Packing;

use GraphAware\Bolt\Tests\Integration\IntegrationTestCase;
use GraphAware\Bolt\Result\Type\Node;
use GraphAware\Bolt\Result\Type\Relationship;
use GraphAware\Bolt\Result\Type\Path;

/**
 * @group packstream
 * @group integration
 * @group graphstructure
 */
class PackingGraphStructureIntegrationTest extends IntegrationTestCase
{
    public function setUp()
    {
        parent::setUp();
        $this->emptyDB();
    }

    /**
     * @group structure-node
     */
    public function testUnpackingNode()
    {
        $session = $this->getSession();
        $result = $session->run("CREATE (n:Node) SET n.time = {t}, n.desc = {d} RETURN n", ['t' => time(), 'd' => 'GraphAware is awesome !']);

        $this->assertTrue($result->getRecord()->value('n') instanceof Node);
        $this->assertEquals('GraphAware is awesome !', $result->getRecord()->value('n')->value('desc'));
    }

    public function testUnpackingUnboundRelationship()
    {
        $session = $this->getSession();
        $result = $session->run("CREATE (n:Node)-[r:RELATES_TO {since: 1992}]->(b:Node) RETURN r");
        $record = $result->getRecord();

        $this->assertTrue($record->value('r') instanceof Relationship);
        $this->assertEquals(1992, $record->value('r')->value('since'));
    }

    public function testUnpackingNodesCollection()
    {
        $session = $this->getSession();
        $session->run("FOREACH (x in range(1,3) | CREATE (n:Node {id: x}))");
        $result = $session->run("MATCH (n:Node) RETURN collect(n) as nodes");

        $this->assertCount(3, $result->getRecord()->value('nodes'));
        foreach ($result->getRecord()->value('nodes') as $node) {
            /** @var \GraphAware\Bolt\Result\Type\Node $node */
            $this->assertTrue(in_array('Node', $node->labels()));
        }
    }

    /**
     * @group path
     */
    public function testUnpackingPaths()
    {
        $session = $this->getSession();
        $session->run("MATCH (n) DETACH DELETE n");
        $session->run("CREATE (a:A {k: 'v'})-[:KNOWS]->(b:B {k:'v2'})-[:LIKES]->(c:C {k:'v3'})<-[:KNOWS]-(a)");
        $result = $session->run("MATCH p=(a:A)-[r*]->(b) RETURN p, length(p) as l");

        $this->assertInstanceOf(Path::class, $result->getRecord()->value('p'));
        $this->assertInternalType('integer', $result->getRecord()->value('l'));
    }
}
