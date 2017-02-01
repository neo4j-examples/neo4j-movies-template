<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\Event;

use GraphAware\Neo4j\Client\Exception\Neo4jExceptionInterface;
use Symfony\Component\EventDispatcher\Event;

class FailureEvent extends Event
{
    /**
     * @var \GraphAware\Neo4j\Client\Exception\Neo4jExceptionInterface
     */
    protected $exception;

    /**
     * @var bool
     */
    protected $shouldThrowException = true;

    public function __construct(Neo4jExceptionInterface $exception)
    {
        $this->exception = $exception;
    }

    /**
     * @return \GraphAware\Neo4j\Client\Exception\Neo4jExceptionInterface
     */
    public function getException()
    {
        return $this->exception;
    }

    public function disableException()
    {
        $this->shouldThrowException = false;
    }

    /**
     * @return bool
     */
    public function shouldThrowException()
    {
        return $this->shouldThrowException;
    }
}