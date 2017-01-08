<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Common\Tests\Protocol;

use GraphAware\Common\Driver\Protocol;

/**
 * @group unit
 * @group driver
 * @group driver-tck
 */
class ProtocolEnumUnitTest extends \PHPUnit_Framework_TestCase
{
    public function testDifferentProtocolsEnums()
    {
        $this->assertEquals('HTTP', Protocol::HTTP);
        $this->assertEquals('HTTPS', Protocol::HTTPS);
        $this->assertEquals('TCP', Protocol::TCP);
        $this->assertEquals('TLS', Protocol::TLS);
        $this->assertEquals('WS', Protocol::WS);
        $this->assertEquals('WSS', Protocol::WSS);
    }
}