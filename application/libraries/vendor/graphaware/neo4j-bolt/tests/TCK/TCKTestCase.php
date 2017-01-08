<?php

namespace GraphAware\Bolt\Tests\TCK;

use GraphAware\Bolt\Driver;
use GraphAware\Bolt\GraphDatabase;

class TCKTestCase extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \GraphAware\Bolt\Driver
     */
    private $driver;

    public function setUp()
    {
        $this->driver = GraphDatabase::driver("bolt://localhost");
    }

    /**
     * @return \GraphAware\Bolt\Driver
     */
    protected function getDriver()
    {
        return $this->driver;
    }
}