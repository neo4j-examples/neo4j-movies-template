<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\Formatter\Type;

use GraphAware\Common\Type\NodeInterface;
use GraphAware\Common\Type\PathInterface;
use GraphAware\Common\Type\RelationshipInterface;

class Path implements PathInterface
{
    /**
     * @var \GraphAware\Neo4j\Client\Formatter\Type\Node[]
     */
    protected $nodes;

    /**
     * @var \GraphAware\Neo4j\Client\Formatter\Type\Relationship[]
     */
    protected $relationships;

    /**
     * Path constructor.
     * @param array $nodes
     * @param array $relationships
     */
    public function __construct(array $nodes, array $relationships)
    {
        $this->nodes = $nodes;
        $this->relationships = $relationships;
    }

    /**
     * @return \GraphAware\Neo4j\Client\Formatter\Type\Node
     */
    function start()
    {
        return $this->nodes[0];
    }

    /**
     * @return \GraphAware\Neo4j\Client\Formatter\Type\Node
     */
    function end()
    {
        return $this->nodes[count($this->nodes)-1];
    }

    /**
     * @return int
     */
    function length()
    {
        return count($this->relationships);
    }

    /**
     * @param \GraphAware\Common\Type\NodeInterface $node
     * @return bool
     */
    function containsNode(NodeInterface $node)
    {
        foreach ($this->nodes as $n) {
            if ($n->identity() === $node->identity()) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param \GraphAware\Common\Type\RelationshipInterface $relationship
     * @return bool
     */
    function containsRelationship(RelationshipInterface $relationship)
    {
        foreach ($this->relationships as $rel) {
            if ($rel->identity() === $relationship->identity()) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return array|\GraphAware\Neo4j\Client\Formatter\Type\Node[]
     */
    function nodes()
    {
        return $this->nodes;
    }

    /**
     * @return array|\GraphAware\Neo4j\Client\Formatter\Type\Relationship[]
     */
    function relationships()
    {
        return $this->relationships;
    }

}