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

interface MapAccessor
{
    /**
     * Retrieve the keys of the underlying map.
     *
     * @return array
     */
    public function keys();

    /**
     * Check if the list of keys contains the given key.
     *
     * @param string $key
     *
     * @return bool
     */
    public function containsKey($key);

    /**
     * Retrieve the value of the property with the given key.
     *
     * @param string $key
     *
     * @return mixed
     */
    public function get($key);

    /**
     * Returns whether or not the property map contains the given key.
     *
     * @param string $key
     *
     * @return bool
     */
    public function hasValue($key);

    /**
     * Returns the value for the given key, throws an exception if the key doesn't exist or returns the default given value if passed.
     *
     * @param string $key
     * @param mixed  $default
     * 
     * @return mixed
     *
     * @throws \InvalidArgumentException
     */
    public function value($key, $default = null);

    /**
     * Retrieve all values of the underlying collection.
     *
     * @return array
     */
    public function values();

    /**
     * Returns a map of key value pairs of the underlying collection.
     *
     * @return array
     */
    public function asArray();
}
