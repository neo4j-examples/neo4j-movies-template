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
 * PropertyBag is a Common API for handling both Nodes and Relationships properties.
 * It acts as a container for key/value pairs.
 */
class PropertyBag implements PropertyBagInterface
{
    /**
     * @var array
     */
    protected $properties;

    /**
     * @param array $properties
     */
    public function __construct(array $properties = array())
    {
        $this->properties = $properties;
    }

    /**
     * {@inheritdoc}
     */
    public function getProperty($key)
    {
        if (!array_key_exists($key, $this->properties)) {
            throw new \InvalidArgumentException(sprintf('No property with key "%s" found', $key));
        }

        return $this->properties[$key];
    }

    /**
     * {@inheritdoc}
     */
    public function hasProperty($key)
    {
        return array_key_exists($key, $this->properties);
    }

    /**
     * {@inheritdoc}
     */
    public function getProperties()
    {
        return $this->properties;
    }

    /**
     * {@inheritdoc}
     */
    public function setProperty($key, $value)
    {
        $this->properties[$key] = $value;
    }
}
