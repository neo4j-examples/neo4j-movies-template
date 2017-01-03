<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Tests\Documentation;

use GraphAware\Bolt\GraphDatabase;
use GraphAware\Common\Driver\DriverInterface;

/**
 * Class DocumentationTest
 *
 * @group documentation
 */
class DocumentationTest extends \PHPUnit_Framework_TestCase
{
    public function testSetup()
    {
        /**
         * Creating a driver
         */

        $driver = GraphDatabase::driver("bolt://localhost");
        $this->assertInstanceOf(DriverInterface::class, $driver);
    }
}