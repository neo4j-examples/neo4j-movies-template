<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\HttpDriver;

use GraphAware\Common\Transaction\TransactionInterface;
use GraphAware\Neo4j\Client\Exception\Neo4jException;
use GraphAware\Neo4j\Client\HttpDriver\Session;
use GraphAware\Common\Cypher\Statement;

class Transaction implements TransactionInterface
{
    const OPENED = 'OPEN';

    const COMMITED = 'COMMITED';

    const ROLLED_BACK = 'ROLLED_BACK';

    protected $state;

    protected $session;

    protected $closed = false;

    protected $transactionId;

    protected $expires;

    public function __construct(Session $session)
    {
        $this->session = $session;
        $this->session->transaction = $this;
    }

    public function isOpen()
    {
        return $this->state === self::OPENED;
    }

    public function isCommited()
    {
        return $this->state === self::COMMITED;
    }

    public function isRolledBack()
    {
        return $this->state === self::ROLLED_BACK;
    }

    public function getStatus()
    {
        return $this->state;
    }

    public function begin()
    {
        $this->assertNotStarted();
        $response = $this->session->begin();
        $body = json_decode($response->getBody(), true);
        $parts = explode('/', $body['commit']);
        $this->transactionId = (int) $parts[count($parts)-2];
        $this->state = self::OPENED;
        $this->session->transaction = $this;
    }

    public function run(Statement $statement)
    {
        $this->assertStarted();
        try {
            $results =  $this->session->pushToTransaction($this->transactionId, array($statement));

            return $results->results()[0];
        } catch (Neo4jException $e) {
            if ($e->effect() === Neo4jException::EFFECT_ROLLBACK) {
                $this->closed = true;
                $this->state = self::ROLLED_BACK;
            }

            throw $e;
        }
    }

    public function runMultiple(array $statements)
    {
        try {
            return $this->session->pushToTransaction($this->transactionId, $statements);
        } catch (Neo4jException $e) {
            if ($e->effect() === Neo4jException::EFFECT_ROLLBACK) {
                $this->closed = true;
                $this->state = self::ROLLED_BACK;

                throw $e;
            }
        }
    }

    public function success()
    {
        $this->assertNotClosed();
        $this->assertStarted();
        $this->session->commitTransaction($this->transactionId);
        $this->state = self::COMMITED;
        $this->closed = true;
        $this->session->transaction = null;
    }

    public function rollback()
    {
        $this->assertNotClosed();
        $this->assertStarted();
        $this->session->rollbackTransaction($this->transactionId);
        $this->closed = true;
        $this->state = self::ROLLED_BACK;
        $this->session->transaction = null;
    }

    private function assertStarted()
    {
        if ($this->state !== self::OPENED) {
            throw new \RuntimeException('This transaction has not been started');
        }
    }

    private function assertNotStarted()
    {
        if (null !== $this->state) {
            throw new \RuntimeException(sprintf('Can not begin transaction, Transaction State is "%s"', $this->state));
        }
    }

    private function assertNotClosed()
    {
        if (false !== $this->closed) {
            throw new \RuntimeException('This Transaction is closed');
        }
    }

    public function status()
    {
        return $this->state;
    }

    public function commit()
    {
        $this->success();
    }

    public function push($query, array $parameters = array(), $tag = null)
    {
        //
    }

    public function getSession()
    {
        return $this->session;
    }


}