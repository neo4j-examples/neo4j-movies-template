<?php

namespace GraphAware\Bolt\Tests\TCK;

use GraphAware\Common\Type\NodeInterface;
use GraphAware\Common\Type\RelationshipInterface;
use GraphAware\Common\Type\PathInterface;

/**
 * @group tck
 * @group tck9
 */
class TCK9TypesTest extends TCKTestCase
{
    /**
     * Scenario: To ensure safe escaped provision of user supplied values
     *  Given a session
     *  And a user supplied value of type<type>
     *  |null|
     *  |boolean|
     *  |int|
     *  |float|
     *  |string|
     *  |list<any>|
     *  |map<string:any>|
     *
     *  When I pass the value as parameter "x" to a "RETURN {x}" statement
     *  Then I should receive the same value in the result
     *
     */
    public function testSafeEscapedProvision()
    {
        // null
        $this->assertEquals(null, $this->runValue(null));

        // boolean
        $this->assertEquals(true, $this->runValue(true));
        $this->assertEquals(false, $this->runValue(false));

        // int
        $this->assertEquals(1, $this->runValue(1));
        $this->assertEquals(10000, $this->runValue(10000));
        $this->assertEquals(1000000000, $this->runValue(1000000000));

        // float
        $this->assertEquals(1.0, $this->runValue(1.0));
        $this->assertEquals(pi(), $this->runValue(pi()));

        // string
        $this->assertEquals('GraphAware is awesome !', $this->runValue('GraphAware is awesome !'));

        // list
        $this->assertEquals(array(0,1,2), $this->runValue(array(0,1,2)));
        $this->assertEquals(array("one", "two", "three"), $this->runValue(array("one", "two", "three")));

        // map
        $this->assertEquals(['zone' => 1, 'code' => 'neo.TransientError'], $this->runValue(['zone' => 1, 'code' => 'neo.TransientError']));
    }

    /**
     * Scenario: To handle a value of any type returned within a Cypher result
     *  Given a Result containing a value of type <type>
     *   |null|
     *   |boolean|
     *   |string|
     *   |float|
     *   |int|
     *   |list<any>|
     *   |map<string:any>|
     *   |node|
     *   |relationship|
     *   |path|
     *  When I extract the value from the Result
     *  Then it should be mapped to appropriate language-idiomatic value
     */
    public function testResultTypes()
    {
        $driver = $this->getDriver();
        $session = $driver->session();

        // null
        $result = $session->run("CREATE (n) RETURN n.key as nilKey");
        $this->assertEquals(null, $result->getRecord()->value('nilKey'));

        // collection of null
        $result = $session->run("UNWIND range(0, 2) as r CREATE (n) RETURN collect(n.x) as x");
        $this->assertInternalType('array', $result->getRecord()->value('x'));
        foreach ($result->getRecord()->value('x') as $v) {
            $this->assertEquals(null, $v);
        }

        // boolean
        $result = $session->run("CREATE (n) RETURN id(n) = id(n) as bool, id(n) = 'a' as bool2");
        $this->assertEquals(true, $result->getRecord()->value('bool'));
        $this->assertEquals(false, $result->getRecord()->value('bool2'));

        // collection of booleans
        $result = $session->run("UNWIND range(0, 2) as r CREATE (n) SET n.x = (id(n) = id(n)) RETURN collect(n.x) as x");
        $this->assertInternalType('array', $result->getRecord()->value('x'));
        foreach ($result->getRecord()->value('x') as $v) {
            $this->assertEquals(true, $v);
        }

        // string
        $result = $session->run("CREATE (n {k: {value}}) RETURN n.k as v", ['value' => 'text']);
        $this->assertEquals('text', $result->getRecord()->value('v'));

        // float
        $result = $session->run("CREATE (n {k: {value}}) RETURN n.k as v", ['value' => 1.38]);
        $this->assertEquals(1.38, $result->getRecord()->value('v'));

        // collection of floats
        $result = $session->run("UNWIND range(0,2) as r CREATE (n:X) SET n.k = (id(n) / 100.0f) RETURN collect(n.k) as x");
        $this->assertCount(3, $result->getRecord()->value('x'));
        foreach ($result->getRecord()->value('x') as $v) {
            $this->assertInternalType('float', $v);
        }

        // int
        $result = $session->run("CREATE (n) RETURN id(n) as id");
        $this->assertInternalType('int', $result->getRecord()->value('id'));
        $this->assertTrue($result->getRecord()->value('id') >= 0);

        // collection of integers
        $result = $session->run("UNWIND range(0, 2) as r CREATE (n:X) SET n.k = id(n) RETURN collect(n.k) as x");
        $this->assertCount(3, $result->getRecord()->value('x'));
        foreach ($result->getRecord()->value('x') as $v) {
            $this->assertInternalType('int', $v);
        }

        // list<any>
        $result = $session->run("CREATE (n:Person:Male) RETURN labels(n) as l");
        $this->assertInternalType('array', $result->getRecord()->value('l'));
        $this->assertTrue(array_key_exists(0, $result->getRecord()->value('l')));
        $this->assertTrue(array_key_exists(1, $result->getRecord()->value('l')));

        // collection of list<any>
        $result = $session->run("UNWIND range(0, 2) as r CREATE (n:X) RETURN collect(labels(n)) as x");
        $this->assertCount(3, $result->getRecord()->value('x'));
        foreach ($result->getRecord()->value('x') as $v) {
            $this->assertInternalType('array', $v);
            $this->assertEquals('X', $v[0]);
        }

        // map<string:any>
        $result = $session->run("CREATE (n:Node) RETURN {id: id(n), labels: labels(n)} as map");
        $this->assertInternalType('array', $result->getRecord()->value('map'));
        $this->assertTrue(array_key_exists('id', $result->getRecord()->value('map')));
        $this->assertTrue(array_key_exists('labels', $result->getRecord()->value('map')));
        $this->assertInternalType('int', $result->getRecord()->value('map')['id']);
        $this->assertInternalType('array', $result->getRecord()->value('map')['labels']);

        // collection of map<string:any>
        $result = $session->run("UNWIND range(0, 2) as r CREATE (n:X) RETURN collect({labels: labels(n)}) as x");
        $this->assertCount(3, $result->getRecord()->value('x'));
        foreach ($result->getRecord()->value('x') as $v) {
            $this->assertInternalType('array', $v);
            $this->assertArrayHasKey('labels', $v);
            $this->assertEquals('X', $v['labels'][0]);
        }

        // node
        $result = $session->run("CREATE (n:Node) RETURN n");
        $this->assertInstanceOf(NodeInterface::class, $result->getRecord()->value('n'));
        $this->assertTrue($result->getRecord()->value('n')->hasLabel('Node'));

        // collection of nodes
        $result = $session->run("UNWIND range(0,2) as r CREATE (n:Node {value: r}) RETURN collect(n) as n");
        $this->assertCount(3, $result->getRecord()->value('n'));
        foreach ($result->getRecord()->value('n') as $k => $n) {
            $this->assertInstanceOf(NodeInterface::class, $n);
            $this->assertEquals($k, $n->value('value'));
        }

        // map<string:node>
        $result = $session->run("CREATE (n:X) RETURN {created: n} as x");
        $this->assertInstanceOf(NodeInterface::class, $result->getRecord()->value('x')['created']);

        // collection of map<string:<collection node>>
        $result = $session->run("UNWIND range(0, 2) as r CREATE (n:X) WITH collect(n) as n RETURN collect({nodes: n}) as x");
        $this->assertCount(1, $result->getRecord()->value('x'));
        $this->assertArrayHasKey('nodes', $result->getRecord()->value('x')[0]);
        $this->assertCount(3, $result->getRecord()->value('x')[0]['nodes']);
        $this->assertInstanceOf(NodeInterface::class, $result->getRecord()->value('x')[0]['nodes'][0]);

        // relationship
        $result = $session->run("CREATE (n:X)-[r:REL]->(z:X) RETURN r");
        $this->assertInstanceOf(RelationshipInterface::class, $result->getRecord()->value('r'));
        $this->assertEquals('REL', $result->getRecord()->value('r')->type());
        $this->assertTrue($result->getRecord()->value('r')->hasType('REL'));

        // path
        $result = $session->run("CREATE p=(n:X)-[:REL]->(o:Y)-[:REL]->(i:Z) RETURN p");
        $this->assertInstanceOf(PathInterface::class, $result->getRecord()->value('p'));
        $this->assertCount(3, $result->getRecord()->value('p')->nodes());
        $this->assertCount(2, $result->getRecord()->value('p')->relationships());
        $this->assertEquals(2, $result->getRecord()->value('p')->length());
        foreach ($result->getRecord()->value('p')->nodes() as $node) {
            $this->assertInstanceOf(NodeInterface::class, $node);
        }
        foreach ($result->getRecord()->value('p')->relationships() as $rel) {
            $this->assertInstanceOf(RelationshipInterface::class, $rel);
        }
    }

    private function runValue($value)
    {
        $driver = $this->getDriver();
        $session = $driver->session();
        $result = $session->run("RETURN {x} as x", ['x' => $value]);

        return $result->getRecord()->value('x');
    }
}