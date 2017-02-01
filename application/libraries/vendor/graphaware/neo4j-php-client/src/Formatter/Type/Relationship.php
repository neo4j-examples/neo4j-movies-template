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

use GraphAware\Common\Type\RelationshipInterface;

class Relationship extends MapAccess implements RelationshipInterface
{
    /**
     * @var int
     */
    protected $id;

    /**
     * @var string
     */
    protected $type;

    /**
     * @var int
     */
    protected $startNodeIdentity;

    /**
     * @var int
     */
    protected $endNodeIdentity;

    /**
     * @var array
     */
    protected $properties;

    /**
     * Relationship constructor.
     * @param $id
     * @param $type
     * @param $startNodeId
     * @param $endNodeId
     * @param array $properties
     */
    public function __construct($id, $type, $startNodeId, $endNodeId, array $properties)
    {
        $this->id = $id;
        $this->type = $type;
        $this->startNodeIdentity = $startNodeId;
        $this->endNodeIdentity = $endNodeId;
        $this->properties = $properties;
    }

    /**
     * @return mixed
     */
    public function identity()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function type()
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return bool
     */
    public function hasType($type)
    {
        return $type === $this->type;
    }

    /**
     * @return mixed
     */
    public function startNodeIdentity()
    {
        return $this->startNodeIdentity;
    }

    /**
     * @return mixed
     */
    public function endNodeIdentity()
    {
        return $this->endNodeIdentity;
    }
}