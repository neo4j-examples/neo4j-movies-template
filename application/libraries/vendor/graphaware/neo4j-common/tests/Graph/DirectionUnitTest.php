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

/**
 * @group unit
 * @group graph
 */
class DirectionUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testInstance()
    {
        $direction = new Direction(Direction::INCOMING);
        $this->assertEquals("INCOMING", $direction);

        $out = new Direction(Direction::OUTGOING);
        $this->assertEquals("OUTGOING", $out);

        $both = new Direction(Direction::BOTH);
        $this->assertEquals("BOTH", $both);
    }

    public function testStaticMethodCalls()
    {
        $inc = Direction::INCOMING();
        $this->assertEquals(Direction::INCOMING, $inc);

        $out = Direction::OUTGOING();
        $this->assertEquals(Direction::OUTGOING, $out);

        $both = Direction::BOTH();
        $this->assertEquals(Direction::BOTH, $both);
    }
}