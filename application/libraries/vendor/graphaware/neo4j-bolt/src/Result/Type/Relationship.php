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

use GraphAware\Common\Type\RelationshipInterface;

class Relationship extends MapAccess implements RelationshipInterface
{
    /**
     * @var int
     */
    protected $identity;

    /**
     * @var int
     */
    protected $startNodeIdentity;

    /**
     * @var int
     */
    protected $endNodeIdentity;

    /**
     * @var string
     */
    protected $type;

    /**
     * Relationship constructor.
     * @param int $identity
     * @param int $startNodeIdentity
     * @param int $endNodeIdentity
     * @param string $type
     * @param array $properties
     */
    public function __construct($identity, $startNodeIdentity, $endNodeIdentity, $type, array $properties = array())
    {
        $this->identity = $identity;
        $this->startNodeIdentity = $startNodeIdentity;
        $this->endNodeIdentity = $endNodeIdentity;
        $this->type = $type;
        $this->properties = $properties;
    }

    /**
     * @return int
     */
    public function identity()
    {
        return $this->identity;
    }

    /**
     * @return int
     */
    public function startNodeIdentity()
    {
        return $this->startNodeIdentity;
    }

    /**
     * @return int
     */
    public function endNodeIdentity()
    {
        return $this->endNodeIdentity;
    }

    /**
     * @return string
     */
    public function type()
    {
        return $this->type;
    }

    /**
     * @param string $type
     *
     * @return bool
     */
    public function hasType($type)
    {
        return $this->type === $type;
    }
}