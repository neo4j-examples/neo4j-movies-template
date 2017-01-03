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

use GraphAware\Common\Type\NodeInterface;

class Node extends MapAccess implements NodeInterface
{
    /**
     * @var int
     */
    protected $id;

    /**
     * @var array
     */
    protected $labels = [];

    /**
     * @var array
     */
    protected $properties = [];

    public function __construct($id, array $labels, array $properties)
    {
        $this->id = $id;
        $this->labels = $labels;
        $this->properties = $properties;
    }

    /**
     * @return int
     */
    public function identity()
    {
        return $this->id;
    }

    /**
     * @return string[]
     */
    public function labels()
    {
        return $this->labels;
    }

    /**
     * @param string $label
     *
     * @return bool
     */
    public function hasLabel($label)
    {
        return in_array($label, $this->labels);
    }
}