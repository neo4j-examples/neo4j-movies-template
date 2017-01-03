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

class RelationshipType
{
    /**
     * @var string
     */
    protected $name;

    /**
     * @param string $name
     */
    private function __construct($name)
    {
        $this->name = $name;
    }

    /**
     * @param string $name
     * 
     * @return RelationshipType
     */
    public static function withName($name)
    {
        return new self((string) $name);
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->name;
    }
}
