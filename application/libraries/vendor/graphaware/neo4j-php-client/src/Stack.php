<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client;

use GraphAware\Common\Cypher\Statement;

class Stack
{
    /**
     * @var null|string
     */
    protected $tag;

    /**
     * @var string
     */
    protected $connectionAlias;

    /**
     * @var \GraphAware\Common\Cypher\Statement[]
     */
    protected $statements = [];

    /**
     * Stack constructor.
     * @param null $tag
     */
    public function __construct($tag = null, $connectionAlias = null)
    {
        $this->tag = null !== $tag ? (string) $tag : null;
        $this->connectionAlias = $connectionAlias;
    }

    /**
     * @param string|null $tag
     * @return \GraphAware\Neo4j\Client\Stack
     */
    public static function create($tag = null, $connectionAlias = null)
    {
        return new self($tag, $connectionAlias);
    }

    /**
     * @param $query
     * @param null|array $parameters
     */
    public function push($query, $parameters = null, $tag = null)
    {
        $params = null !== $parameters ? $parameters : array();
        $this->statements[] = Statement::create($query, $params, $tag);
    }

    /**
     * @return int
     */
    public function size()
    {
        return count($this->statements);
    }

    /**
     * @return \GraphAware\Common\Cypher\Statement[]
     */
    public function statements()
    {
        return $this->statements;
    }

    /**
     * @return null|string
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * @return null|string
     */
    public function getConnectionAlias()
    {
        return $this->connectionAlias;
    }
}
