<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Type;

interface Relationship extends MapAccessor, Identity
{
    /**
     * Returns the type of the relationship.
     *
     * @return string
     */
    public function type();

    /**
     * Returns whether or not the relationship has the given type.
     *
     * @param string $type
     *
     * @return bool
     */
    public function hasType($type);
}
