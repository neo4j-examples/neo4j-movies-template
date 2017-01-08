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

use GraphAware\Common\Cypher\StatementType;

/**
 * @group unit
 * @group cypher
 * @group tck
 */
class StatementTypeUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testStatementTypeStrings()
    {
        $this->assertEquals("STATEMENT_READ_WRITE", StatementType::READ_WRITE);
        $this->assertEquals("STATEMENT_READ_ONLY", StatementType::READ_ONLY);
    }
}