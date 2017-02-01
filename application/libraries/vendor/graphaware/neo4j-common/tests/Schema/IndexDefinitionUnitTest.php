<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Common\Tests\Schema;

use GraphAware\Common\Schema\ConstraintType;
use GraphAware\Common\Schema\IndexDefinition;
use GraphAware\Common\Graph\Label;

/**
 * @group unit
 * @group schema
 */
class IndexDefinitionUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testInstance()
    {
        $def = new IndexDefinition(Label::label("User"), "login");
        $this->assertInstanceOf(IndexDefinition::class, $def);
    }

    public function testUniqueChecks()
    {
        $def = new IndexDefinition(Label::label("User"), "login", ConstraintType::UNIQUENESS());
        $this->assertTrue($def->isUnique());
        $this->assertEquals(ConstraintType::UNIQUENESS, $def->getConstraintType());
    }
}