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

use GraphAware\Common\Cypher\Statement;

class Pipeline
{
    protected $session;

    /**
     * @var \GraphAware\Common\Cypher\Statement[]
     */
    protected $statements = [];

    public function __construct(Session $session)
    {
        $this->session = $session;
    }

    public function push($query, array $parameters = array(), $tag = null)
    {
        $this->statements[] = Statement::create($query, $parameters, $tag);
    }

    public function run()
    {
        return $this->session->flush($this);
    }

    public function statements()
    {
        return $this->statements;
    }

    public function size()
    {
        return count($this->statements);
    }
}