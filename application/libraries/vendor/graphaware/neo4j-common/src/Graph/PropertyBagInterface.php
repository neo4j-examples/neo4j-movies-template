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

interface PropertyBagInterface
{
    /**
     * Returns a property value for the given <code>$key</code>. Throws an exception if not found.
     *
     * @param string $key
     *
     * @return mixed
     *
     * @throws \InvalidArgumentException when the object has no property with the given <code>$key</code>
     */
    public function getProperty($key);

    /**
     * Returns whether or not a property exist with the given <code>$key</code>.
     *
     * @param string $key
     *
     * @return bool
     */
    public function hasProperty($key);

    /**
     * Returns all properties of this bag.
     *
     * @return array
     */
    public function getProperties();

    /**
     * Sets a property value for the given <code>$key</code>.
     *
     * @param string $key
     * @param mixed  $value
     */
    public function setProperty($key, $value);
}
