<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Common\Tests\Result;

use GraphAware\Common\Result\StatementStatistics;
use GraphAware\Common\Result\StatementStatisticsInterface;
use InvalidArgumentException;

/**
 * @group unit
 * @group result
 * @group summary
 */
class StatementStatisticsUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testNoStats()
    {
        $stats = new StatementStatistics();
        $this->assertInstanceOf(StatementStatisticsInterface::class, $stats);
        $this->assertFalse($stats->containsUpdates());
        $this->assertEquals(0, $stats->nodesCreated());
    }

    public function testStatsAreMerged()
    {
        $stats = new StatementStatistics([
            'contains_updates' => true,
            'nodes_created' => 10,
            'properties_set' => 90
        ]);
        $this->assertTrue($stats->containsUpdates());
        $this->assertEquals(10, $stats->nodesCreated());
        $this->assertEquals(90, $stats->propertiesSet());
    }

    public function testExceptionIsThrownWhenInvalidKey()
    {
        $this->setExpectedException(InvalidArgumentException::class);
        $stats = new StatementStatistics(['inv' => 10]);
    }

    public function testStatsReturnsUpdatesTrueIfItHappensButNotProvided()
    {
        $stats = [
            'nodes_created' => 1
        ];
        $o = new StatementStatistics($stats);
        $this->assertTrue($o->containsUpdates());
    }
}