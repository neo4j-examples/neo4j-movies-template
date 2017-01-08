<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Result\Type;

use GraphAware\Common\Type\NodeInterface;
use GraphAware\Common\Type\PathInterface;
use GraphAware\Common\Type\RelationshipInterface;

class Path implements PathInterface
{
    /**
     * @var array|\GraphAware\Bolt\Result\Type\Node[]
     */
    protected $nodes;

    /**
     * @var array|\GraphAware\Bolt\Result\Type\UnboundRelationship[]
     */
    protected $relationships;

    /**
     * @var array|\int[]
     */
    protected $sequence;

    /**
     * Path constructor.
     * @param \GraphAware\Bolt\Result\Type\Node[] $nodes
     * @param \GraphAware\Bolt\Result\Type\UnboundRelationship[] $relationships
     * @param int[] $sequence
     */
    public function __construct(array $nodes, array $relationships, array $sequence)
    {
        $this->nodes = $nodes;
        $this->relationships = $relationships;
        $this->sequence = $sequence;
    }

    /**
     * @return \GraphAware\Bolt\Result\Type\Node
     */
    function start()
    {
        return $this->nodes[0];
    }

    /**
     * @return \GraphAware\Bolt\Result\Type\Node
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
     *
     * @return bool
     */
    function containsNode(NodeInterface $node)
    {
        return in_array($node, $this->nodes);
    }

    /**
     * @param \GraphAware\Common\Type\RelationshipInterface $relationship
     *
     * @return bool
     */
    function containsRelationship(RelationshipInterface $relationship)
    {
        return in_array($relationship, $this->relationships);
    }

    /**
     * @return array|\GraphAware\Bolt\Result\Type\Node[]
     */
    function nodes()
    {
        return $this->nodes;
    }

    /**
     * @return array|\GraphAware\Bolt\Result\Type\UnboundRelationship[]
     */
    function relationships()
    {
        return $this->relationships;
    }

}