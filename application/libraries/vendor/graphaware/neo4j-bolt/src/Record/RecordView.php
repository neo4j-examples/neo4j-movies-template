<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Record;

use GraphAware\Common\Result\RecordViewInterface;
use GraphAware\Common\Type\Node;
use GraphAware\Common\Type\PathInterface;
use GraphAware\Common\Type\RelationshipInterface;

class RecordView implements RecordViewInterface
{
    /**
     * @var array
     */
    protected $keys = [];

    /**
     * @var array
     */
    protected $values = [];

    /**
     * @var array
     */
    private $keyToIndexMap = [];

    /**
     * @return array
     */
    public function keys()
    {
        return $this->keys;
    }

    /**
     * RecordView constructor.
     * @param array $keys
     * @param array $values
     */
    public function __construct(array $keys, array $values)
    {
        $this->keys = $keys;
        $this->values = $values;
        foreach ($this->keys as $i => $k) {
            $this->keyToIndexMap[$k] = $i;
        }
    }

    /**
     * @return bool
     */
    public function hasValues()
    {
        return !empty($this->values);
    }

    /**
     * @param $key
     * @return mixed|\GraphAware\Bolt\Result\Type\Node|\GraphAware\Bolt\Result\Type\Relationship|\GraphAware\Bolt\Result\Type\Path
     */
    public function value($key)
    {
        return $this->values[$this->keyToIndexMap[$key]];
    }

    /**
     * @param $key
     * @return \GraphAware\Bolt\Result\Type\Node|\GraphAware\Bolt\Result\Type\Path|\GraphAware\Bolt\Result\Type\Relationship|mixed
     */
    public function get($key)
    {
        return $this->value($key);
    }

    /**
     * Returns the Node for value <code>$key</code>. Ease IDE integration
     *
     * @param $key
     * @return \GraphAware\Bolt\Result\Type\Node
     *
     * @throws \InvalidArgumentException When the value is not null or instance of Node
     */
    public function nodeValue($key)
    {
        if (!isset($this->keyToIndexMap[$key]) || !$this->values[$this->keyToIndexMap[$key]] instanceof Node) {
            throw new \InvalidArgumentException(sprintf('value for %s is not of type %s', $key, 'NODE'));
        }

        return $this->value($key);
    }

    /**
     * @param $key
     * @return \GraphAware\Bolt\Result\Type\Relationship
     *
     * @throws \InvalidArgumentException When the value is not null or instance of Relationship
     */
    public function relationshipValue($key)
    {
        if (!isset($this->keyToIndexMap[$key]) || !$this->values[$this->keyToIndexMap[$key]] instanceof RelationshipInterface) {
            throw new \InvalidArgumentException(sprintf('value for %s is not of type %s', $key, 'RELATIONSHIP'));
        }

        return $this->value($key);
    }

    /**
     * @param $key
     * @return \GraphAware\Bolt\Result\Type\Path
     *
     * @throws \InvalidArgumentException When the value is not null or instance of Path
     */
    public function pathValue($key)
    {
        if (!isset($this->keyToIndexMap[$key]) || !$this->values[$this->keyToIndexMap[$key]] instanceof PathInterface) {
            throw new \InvalidArgumentException(sprintf('value for %s is not of type %s', $key, 'PATH'));
        }

        return $this->value($key);
    }

    /**
     * @return array
     */
    public function values()
    {
        return $this->values;
    }

    /**
     * @param string $key
     * @return bool
     */
    public function hasValue($key)
    {
        return array_key_exists($key, $this->keyToIndexMap);
    }

    /**
     * @param $index
     * @return mixed
     */
    public function valueByIndex($index)
    {
        return $this->values[$index];
    }

    /**
     * @param $index
     * @return mixed
     */
    public function getByIndex($index)
    {
        return $this->valueByIndex($index);
    }

    /**
     * @return \GraphAware\Bolt\Record\RecordView
     */
    public function record()
    {
        return clone($this);
    }

}