<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Graph;

interface RelationshipInterface extends PropertyBagInterface
{
    /**
     * Returns the Relationship internal id.
     *
     * @return int
     */
    public function getId();

    /**
     * Returns the Relationship type.
     *
     * @return RelationshipType
     */
    public function getType();

    /**
     * Returns the start node of the Relationship.
     *
     * @return NodeInterface
     */
    public function getStartNode();

    /**
     * Returns the end node of the Relationship.
     *
     * @return NodeInterface
     */
    public function getEndNode();

    /**
     * Returns the other node of the Relationship, based on the given <code>Node</code>.
     *
     * @param NodeInterface $node
     *
     * @return NodeInterface
     *
     * @throws \InvalidArgumentException When the given node does not make part of the Relationship
     */
    public function getOtherNode(NodeInterface $node);

    /**
     * Returns the direction of the Relationship for a <code>Node</code> point of view.
     *
     * @param NodeInterface $node
     */
    public function getDirection(NodeInterface $node);

    /**
     * Returns the nodes bound to this Relationship.
     *
     * @return NodeInterface[]
     */
    public function getNodes();

    /**
     * Returns whether or not the Relationship is of the given <code>relationshipType</code>.
     *
     * @param RelationshipType $relationshipType
     * 
     * @return bool
     */
    public function isType(RelationshipType $relationshipType);
}
