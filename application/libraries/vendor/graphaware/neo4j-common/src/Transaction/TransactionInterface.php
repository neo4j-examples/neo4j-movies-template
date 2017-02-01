<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Transaction;

interface TransactionInterface
{
    /**
     * @return bool
     */
    public function isOpen();

    /**
     * @return bool
     */
    public function isCommited();

    /**
     * @return bool
     */
    public function isRolledBack();

    /**
     * @return string
     */
    public function status();

    /**
     */
    public function commit();

    /**
     */
    public function rollback();

    /**
     * @param string      $statement
     * @param array       $parameters
     * @param null|string $tag
     */
    public function push($statement, array $parameters = array(), $tag = null);
}
