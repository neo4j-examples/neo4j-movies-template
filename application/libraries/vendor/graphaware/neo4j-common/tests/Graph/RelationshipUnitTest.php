<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Common\Tests\Graph;

use GraphAware\Common\Graph\Direction;
use GraphAware\Common\Graph\Node;
use GraphAware\Common\Graph\NodeInterface;
use GraphAware\Common\Graph\Relationship;
use GraphAware\Common\Graph\RelationshipType;
use GraphAware\Common\Graph\RelationshipInterface;
use GraphAware\Common\Graph\PropertyBagInterface;
use \InvalidArgumentException;

/**
 * @group unit
 * @group graph
 */
class RelationshipUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testNewInstance()
    {
        $rel = new Relationship(rand(), RelationshipType::withName("RELATES"), $this->getRandomNode(), $this->getRandomNode());
        $this->assertInstanceOf(RelationshipInterface::class, $rel);
        $this->assertInstanceOf(PropertyBagInterface::class, $rel);
        $this->assertInternalType('integer', $rel->getId());
        $this->assertEquals("RELATES", $rel->getType());
        $this->assertInstanceOf(NodeInterface::class, $rel->getStartNode());
        $this->assertInstanceOf(NodeInterface::class, $rel->getEndNode());
        $this->assertTrue($rel->isType(RelationshipType::withName("RELATES")));
    }

    public function testGetOtherNode()
    {
        $n1 = $this->getRandomNode();
        $n2 = $this->getRandomNode();
        $n3 = $this->getRandomNode();
        $rel = new Relationship(1, RelationshipType::withName("RELATES"), $n1, $n2);
        $this->assertEquals($n2, $rel->getOtherNode($n1));
        $this->assertEquals($n1, $rel->getOtherNode($n2));
        $this->setExpectedException(InvalidArgumentException::class);
        $rel->getOtherNode($n3);
    }

    public function testGetDirection()
    {
        $n1 = $this->getRandomNode();
        $n2 = $this->getRandomNode();
        $n3 = $this->getRandomNode();
        $rel = new Relationship(1, RelationshipType::withName("RELATES"), $n1, $n2);
        $this->assertEquals(Direction::OUTGOING, $rel->getDirection($n1));
        $this->assertEquals(Direction::INCOMING, $rel->getDirection($n2));
        $this->setExpectedException(InvalidArgumentException::class);
        $rel->getDirection($n3);
    }

    private function getRandomNode()
    {
        return new Node(rand());
    }
}