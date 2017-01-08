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

use GraphAware\Common\Graph\Label;

/**
 * @group unit
 * @group graph
 */
class LabelUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testInstance()
    {
        $label = new Label("User");
        $this->assertInstanceOf(Label::class, $label);
        $this->assertEquals("User", $label->getName());
    }

    public function testStatic()
    {
        $label = Label::label("User");
        $this->assertInstanceOf(Label::class, $label);
        $this->assertEquals("User", $label->getName());
    }

    public function testClassImplementsToString()
    {
        $label = Label::label("User");
        $this->assertEquals("User", (string) $label);
    }
}