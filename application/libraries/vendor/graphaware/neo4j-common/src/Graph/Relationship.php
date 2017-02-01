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

class Relationship extends PropertyBag implements RelationshipInterface
{
    /**
     * @var int
     */
    protected $id;

    /**
     * @var RelationshipType
     */
    protected $type;

    /**
     * @var NodeInterface
     */
    protected $startNode;

    /**
     * @var NodeInterface
     */
    protected $endNode;

    /**
     * @param int              $id
     * @param RelationshipType $relationshipType
     * @param NodeInterface    $startNode
     * @param NodeInterface    $endNode
     */
    public function __construct($id, RelationshipType $relationshipType, NodeInterface $startNode, NodeInterface $endNode)
    {
        $this->id = $id;
        $this->type = $relationshipType;
        $this->startNode = $startNode;
        $this->endNode = $endNode;

        parent::__construct();
    }

    /**
     * {@inheritdoc}
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * {@inheritdoc}
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * {@inheritdoc}
     */
    public function getStartNode()
    {
        return $this->startNode;
    }

    /**
     * {@inheritdoc}
     */
    public function getEndNode()
    {
        return $this->endNode;
    }

    /**
     * {@inheritdoc}
     */
    public function getOtherNode(NodeInterface $node)
    {
        if ($node->getId() === $this->startNode->getId()) {
            return $this->endNode;
        } elseif ($node->getId() === $this->endNode->getId()) {
            return $this->startNode;
        }

        throw new \InvalidArgumentException(sprintf(
            'The node with ID "%s" is not part of the relationship with ID "%s"',
            $node->getId(),
            $this->id
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getDirection(NodeInterface $node)
    {
        if ($node !== $this->startNode && $node !== $this->endNode) {
            throw new \InvalidArgumentException(sprintf('The given node is not part of the Relationship'));
        }

        $direction = $node === $this->startNode ? Direction::OUTGOING() : Direction::INCOMING();

        return $direction;
    }

    /**
     * {@inheritdoc}
     */
    public function getNodes()
    {
        return array($this->startNode, $this->endNode);
    }

    /**
     * {@inheritdoc}
     */
    public function isType(RelationshipType $relationshipType)
    {
        return $relationshipType->getName() === $this->type->getName();
    }
}
