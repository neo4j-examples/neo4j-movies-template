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

use GraphAware\Common\Schema\SchemaDefinition;
use GraphAware\Common\Schema\IndexDefinition;
use GraphAware\Common\Graph\Label;
use GraphAware\Common\Schema\ConstraintType;

/**
 * @group unit
 * @group schema
 */
class SchemaDefinitionUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testInstance()
    {
        $def = new SchemaDefinition();
        $this->assertInstanceOf(SchemaDefinition::class, $def);
        $this->assertFalse($def->hasIndexes());
        $this->assertFalse($def->hasUniqueConstraints());
    }

    public function testAddIndexDefinition()
    {
        $def = new SchemaDefinition();
        $def->addIndex(new IndexDefinition(Label::label("User"), "login"));
        $this->assertCount(1, $def->getIndexes());
        $this->assertTrue($def->hasIndexes());
        $this->assertFalse($def->hasUniqueConstraints());
        $this->assertTrue($def->hasIndex(Label::label("User"), "login"));
    }

    public function testUniqueChecks()
    {
        $def = new SchemaDefinition();
        $def->addIndex(new IndexDefinition(Label::label("User"), "login", ConstraintType::UNIQUENESS()));
        $this->assertTrue($def->hasUniqueConstraints());
        $this->assertCount(1, $def->getIndexes());
        $this->assertCount(1, $def->getUniqueConstraints());
    }
}