<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Connection;

use GraphAware\Common\Driver\DriverInterface;

interface ConnectionInterface
{
    /**
     * @param DriverInterface $driver
     * @param null|string     $user
     * @param null|string     $password
     */
    public function __construct(DriverInterface $driver, $user = null, $password = null);

    /**
     * @return DriverInterface
     */
    public function getDriver();

    /**
     * @return null|string
     */
    public function getUser();

    /**
     * @return null|string
     */
    public function getPassword();
}
