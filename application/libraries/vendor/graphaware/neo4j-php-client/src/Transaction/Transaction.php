<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\Transaction;

use GraphAware\Common\Cypher\Statement;
use GraphAware\Common\Transaction\TransactionInterface;
use GraphAware\Neo4j\Client\Exception\Neo4jException;
use GraphAware\Neo4j\Client\Stack;

class Transaction
{
    /**
     * @var \GraphAware\Common\Transaction\TransactionInterface
     */
    private $driverTransaction;

    /**
     * @var array()
     */
    protected $queue = [];

    /**
     * Transaction constructor.
     * @param \GraphAware\Common\Transaction\TransactionInterface $driverTransaction
     */
    public function __construct(TransactionInterface $driverTransaction)
    {
        $this->driverTransaction = $driverTransaction;
    }

    /**
     * Push a statement to the queue, without actually sending it
     *
     * @param string $statement
     * @param array $parameters
     * @param string|null $tag
     */
    public function push($statement, array $parameters = array(), $tag = null)
    {
        $this->queue[] = Statement::create($statement, $parameters, $tag);
    }

    /**
     * @param $statement
     * @param array $parameters
     * @param null $tag
     *
     * @return \GraphAware\Common\Result\Result
     */
    public function run($statement, array $parameters = array(), $tag = null)
    {
        if (!$this->driverTransaction->isOpen() && !in_array($this->driverTransaction->status(), ['COMMITED', 'ROLLED_BACK'])) {
            $this->driverTransaction->begin();
        }
        $result = $this->driverTransaction->run(Statement::create($statement, $parameters, $tag));

        return $result;
    }

    /**
     * Push a statements Stack to the queue, without actually sending it
     *
     * @param \GraphAware\Neo4j\Client\Stack $stack
     */
    public function pushStack(Stack $stack)
    {
        $this->queue[] = $stack;
    }

    public function runStack(Stack $stack)
    {
        if (!$this->driverTransaction->isOpen() && !in_array($this->driverTransaction->status(), ['COMMITED', 'ROLLED_BACK'])) {
            $this->driverTransaction->begin();
        }
        $sts = [];
        foreach ($stack->statements() as $statement) {
            $sts[] = $statement;
        }

        return $this->driverTransaction->runMultiple($sts);
    }

    public function begin()
    {
        $this->driverTransaction->begin();
    }

    public function isOpen()
    {
        return $this->driverTransaction->isOpen();
    }

    public function isCommited()
    {
        return $this->driverTransaction->isCommited();
    }

    public function isRolledBack()
    {
        return $this->driverTransaction->isRolledBack();
    }

    public function status()
    {
        return $this->driverTransaction->status();
    }

    public function commit()
    {
        if (!$this->driverTransaction->isOpen() && !in_array($this->driverTransaction->status(), ['COMMITED', 'ROLLED_BACK'])) {
            $this->driverTransaction->begin();
        }
        if (!empty($this->queue)) {
            $stack = [];
            foreach ($this->queue as $element) {
                if ($element instanceof Stack) {
                    foreach ($element->statements() as $statement) {
                        $stack[] = $statement;
                    }
                } else {
                    $stack[] = $element;
                }
            }

            $result = $this->driverTransaction->runMultiple($stack);
            $this->driverTransaction->commit();
            $this->queue = [];
            return $result;
        } else {
            return $this->driverTransaction->commit();
        }
    }

    public function rollback()
    {
        return $this->driverTransaction->rollback();
    }
}