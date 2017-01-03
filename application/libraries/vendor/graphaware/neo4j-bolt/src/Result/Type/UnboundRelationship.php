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

class UnboundRelationship extends MapAccess implements RelationshipInterface
{
    /**
     * @var string
     */
    protected $identity;

    /**
     * @var string
     */
    protected $type;

    /**
     * UnboundRelationship constructor.
     * @param string $identity
     * @param string $type
     * @param string array $properties
     */
    public function __construct($identity, $type, array $properties)
    {
        $this->identity = $identity;
        $this->type = $type;
        $this->properties = $properties;
    }

    /**
     * @return string
     */
    public function identity()
    {
        return $this->identity;
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
     * @return bool
     */
    public function hasType($type)
    {
        return $this->type === $type;
    }

}