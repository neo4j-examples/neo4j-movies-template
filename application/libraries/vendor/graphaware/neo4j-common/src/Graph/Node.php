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

/**
 * Node representation class.
 */
class Node extends PropertyBag implements NodeInterface
{
    /**
     * @var int
     */
    protected $id;

    /**
     * @var Label[]
     */
    protected $labels = [];

    /**
     * @var RelationshipInterface[]
     */
    protected $relationships = [];

    /**
     * @param int   $id
     * @param array $labels
     * @param array $relationships
     */
    public function __construct($id, array $labels = array(), array $relationships = array())
    {
        $this->id = $id;

        foreach ($labels as $label) {
            $this->labels[] = new Label($label);
        }

        foreach ($relationships as $relationship) {
            if (!$relationship instanceof RelationshipInterface) {
                throw new \InvalidArgumentException(sprintf('Relationship must implement RelationshipInterface, "%s" given', json_encode($relationship)));
            }

            $this->relationships[] = $relationship;
        }

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
    public function getLabels()
    {
        return $this->labels;
    }

    /**
     * {@inheritdoc}
     */
    public function hasLabel($name)
    {
        return in_array($name, $this->labels);
    }

    /**
     * {@inheritdoc}
     */
    public function getRelationships()
    {
        return $this->relationships;
    }

    /**
     * {@inheritdoc}
     */
    public function hasRelationships()
    {
        return !empty($this->relationships);
    }

    /**
     * {@inheritdoc}
     */
    public function addRelationship(RelationshipInterface $relationship)
    {
        $this->relationships[] = $relationship;
    }
}
