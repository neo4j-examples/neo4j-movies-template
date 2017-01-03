<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Cypher;

class StatementCollection implements StatementCollectionInterface
{
    /**
     * @var StatementInterface[]
     */
    protected $statements = [];

    /**
     * @var null|string
     */
    protected $tag;

    /**
     * @param null|string $tag
     */
    public function __construct($tag = null)
    {
        $this->tag = null !== $tag ? (string) $tag : null;
    }

    /**
     * {@inheritdoc}
     */
    public function getStatements()
    {
        return $this->statements;
    }

    /**
     * {@inheritdoc}
     */
    public function add(StatementInterface $statement)
    {
        $this->statements[] = $statement;
    }

    /**
     * {@inheritdoc}
     */
    public function isEmpty()
    {
        return empty($this->statements);
    }

    /**
     * {@inheritdoc}
     */
    public function getCount()
    {
        return count($this->statements);
    }

    /**
     * @return null|string
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * @return bool
     */
    public function hasTag()
    {
        return null !== $this->tag;
    }
}
