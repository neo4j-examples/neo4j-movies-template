<?php

namespace GraphAware\Bolt\Tests\Integration\Packing;

use GraphAware\Bolt\Tests\Integration\IntegrationTestCase;

/**
 * @group packing
 * @group integration
 * @group floats
 */
class PackingFloatsIntegrationTest extends IntegrationTestCase
{
    public function setUp()
    {
        parent::setUp();
        $this->emptyDB();
    }

    public function testPackingFloatsPositive()
    {
        $driver = $this->getDriver();
        $session = $driver->session();

        for ($x = 1; $x < 1000; ++$x) {
            $result = $session->run("CREATE (n:Float) SET n.prop = {x} RETURN n.prop as x", ['x' => $x/100]);
            $this->assertEquals($x/100, $result->getRecord()->value('x'));
        }
    }

    public function testPackingFloatsNegative()
    {
        $driver = $this->getDriver();
        $session = $driver->session();

        for ($x = -1; $x > -1000; --$x) {
            $result = $session->run("CREATE (n:Float) SET n.prop = {x} RETURN n.prop as x", ['x' => $x/100]);
            $this->assertEquals($x/100, $result->getRecord()->value('x'));
        }
    }

    public function testPi()
    {
        $driver = $this->getDriver();
        $session = $driver->session();

        $result = $session->run("CREATE (n:Float) SET n.prop = {x} RETURN n.prop as x", ['x' => pi()]);
        $this->assertEquals(pi(), $result->getRecord()->value('x'));
    }
}