<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Common\Tests\Cypher;

use GraphAware\Common\Cypher\Statement;
use GraphAware\Common\Cypher\StatementCollection;

/**
 * @group unit
 * @group cypher
 */
class StatementCollectionUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testNewInstance()
    {
        $coll = new StatementCollection();
        $this->assertInstanceOf(StatementCollection::class, $coll);
        $this->assertTrue($coll->isEmpty());
        $this->assertEquals(0, $coll->getCount());
        $this->assertCount(0, $coll->getStatements());
        $this->assertFalse($coll->hasTag());
        $this->assertNull($coll->getTag());
    }

    public function testAddStatements()
    {
        $coll = new StatementCollection();
        $coll->add($this->getStatement());
        $this->assertFalse($coll->isEmpty());
        $this->assertEquals(1, $coll->getCount());
        $this->assertCount(1, $coll->getStatements());
        $coll->add($this->getStatement());
        $this->assertEquals(2, $coll->getCount());
    }

    public function testTaggedCollection()
    {
        $coll = new StatementCollection("test");
        $this->assertTrue($coll->hasTag());
        $this->assertEquals("test", $coll->getTag());
    }

    private function getStatement()
    {
        return Statement::create("MATCH (n) RETURN n");
    }
}