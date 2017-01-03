<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Schema;

use GraphAware\Common\Graph\Label;

class IndexDefinition
{
    /**
     * @var Label
     */
    protected $label;

    /**
     * @var string
     */
    protected $property;

    /**
     * @var null|ConstraintType
     */
    protected $constraintType;

    /**
     * @param Label               $label
     * @param string              $property
     * @param ConstraintType|null $constraintType
     */
    public function __construct(Label $label, $property, ConstraintType $constraintType = null)
    {
        $this->label = $label;
        $this->property = (string) $property;
        $this->constraintType = $constraintType;
    }

    /**
     * Returns the label on which the index is created.
     *
     * @return Label
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * Returns the property on which the Index is created.
     *
     * @return string
     */
    public function getProperty()
    {
        return $this->property;
    }

    /**
     * Returns the ConstraintType of the Index.
     *
     * @return ConstraintType|null
     */
    public function getConstraintType()
    {
        return $this->constraintType;
    }

    /**
     * Returns whether or not this index is a Uniqueness Constraint.
     *
     * @return bool
     */
    public function isUnique()
    {
        return (string) $this->constraintType === ConstraintType::UNIQUENESS;
    }

    /**
     * Returns whether or not this index is a NodePropertyExistence Constraint.
     *
     * @return bool
     */
    public function isNodePropertyExistence()
    {
        return $this->constraintType === ConstraintType::NODE_PROPERTY_EXISTENCE;
    }
}
