<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Result;

interface Record
{
    /**
     * Returns the keys of the values.
     *
     * @return array
     */
    public function keys();

    /**
     * Returns whether or not this Record has any value.
     *
     * @return bool
     */
    public function hasValues();

    /**
     * Returns the value for the given <code>key</code>.
     *
     * @param string $key
     *
     * @return mixed
     */
    public function value($key);

    /**
     * Retrieve the value for the given <code>key</code>.
     *
     * @param string $key
     *
     * @return mixed
     */
    public function get($key);

    /**
     * Returns whether or not this Record contains a value with the given key.
     *
     * @param string $key
     *
     * @return bool
     */
    public function hasValue($key);

    /**
     * Same as <code>value($key)</code> but will return the value as a <code>NodeInterface</code> object if the type of the
     * value is a <code>Node</code>, throws an exception otherwise.
     *
     * @param string $key
     *
     * @return \GraphAware\Common\Type\NodeInterface
     */
    public function nodeValue($key);

    /**
     * Same as <code>value($key)</code> but will return the value as a <code>RelationshipInterface</code> object if the type of the
     * value is a <code>Relationship</code>, throws an exception otherwise.
     *
     * @param string $key
     *
     * @return \GraphAware\Common\Type\RelationshipInterface
     */
    public function relationshipValue($key);

    /**
     * Same as <code>value($key)</code> but will return the value as a <code>PathInterface</code> object if the type of the
     * value is a <code>Path</code>, throws an exception otherwise.
     *
     * @param string $key
     *
     * @return \GraphAware\Common\Type\PathInterface
     */
    public function pathValue($key);

    /**
     * Returns all the values of this Record.
     *
     * @return array
     */
    public function values();

    /**
     * @param int $index
     *
     * @return mixed
     */
    public function valueByIndex($index);

    /**
     * Retrieve the value at the given field index.
     *
     * @param int $index
     *
     * @return mixed
     */
    public function getByIndex($index);

    /**
     * Returns a copy of this Record.
     *
     * @return RecordCursorInterface
     */
    public function record();
}
