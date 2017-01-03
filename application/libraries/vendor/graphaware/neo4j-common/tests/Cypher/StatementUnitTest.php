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
use GraphAware\Common\Cypher\StatementType;
use InvalidArgumentException;

/**
 * @group unit
 * @group cypher
 * @group tck
 */
class StatementUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testStatementInstance()
    {
        $q = $this->text();
        $st = Statement::create($q);
        $this->assertInstanceOf(Statement::class, $st);
        $this->assertEquals($q, $st->text());
        $this->assertCount(0, $st->parameters());
        $this->assertFalse($st->hasTag());
    }

    public function testStatementWithParams()
    {
        $st = Statement::create($this->text(), $this->getParams());
        $this->assertCount(1, $st->parameters());
    }

    public function testStatementTagged()
    {
        $st = Statement::create($this->text(), $this->getParams(), "test");
        $this->assertEquals("test", $st->getTag());
        $this->assertTrue($st->hasTag());
    }

    public function testStatementTypeIsWriteByDefault()
    {
        $st = Statement::create($this->text());
        $this->assertEquals(StatementType::READ_WRITE, $st->statementType());
    }

    public function testStatementCanBeDefinedAsRead()
    {
        $st = Statement::create($this->text(), array(), null, StatementType::READ_ONLY);
        $this->assertEquals(StatementType::READ_ONLY, $st->statementType());
    }

    public function testExceptionIsThrownWhenInvalidTypeIsGiven()
    {
        $this->setExpectedException(InvalidArgumentException::class);
        Statement::create($this->text(), $this->getParams(), null, "Invalid");
    }

    public function testImmutableStatementAPI()
    {
        $statement = Statement::create($this->text());
        $newText = 'CREATE (n:Node) RETURN n';
        $st = $statement->withText($newText);
        $this->assertEquals($newText, $st->text());
        $this->assertEquals($this->text(), $statement->text());
        $st2 = $st->withParameters(['name' => 'johndoe', 'company' => 'GraphAware']);
        $this->assertCount(0, $st->parameters());
        $this->assertCount(2, $st2->parameters());
        $this->assertEquals($newText, $st2->text());
        $st3 = $st2->withUpdatedParameters(['name' => 'johndoe', 'company' => 'GraphAware Limited']);
        $this->assertEquals('GraphAware Limited', $st3->parameters()['company']);
    }

    private function text()
    {
        $q = "MATCH (n) RETURN count(n)";

        return $q;
    }

    private function getParams()
    {
        return array('id' => 1);
    }
}