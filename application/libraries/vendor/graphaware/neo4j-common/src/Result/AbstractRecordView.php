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

abstract class AbstractRecordView implements RecordViewInterface
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
    protected $indexMap = [];

    /**
     * @param array $keys
     * @param array $values
     */
    public function __construct(array $keys, array $values)
    {
        $this->keys = $keys;
        $this->values = $values;

        foreach ($this->values as $k => $value) {
            $this->indexMap[] = $k;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function keys()
    {
        return $this->keys;
    }

    /**
     * @return mixed[]|\GraphAware\Common\Type\NodeInterface[]|\GraphAware\Common\Type\RelationshipInterface[]|\GraphAware\Common\Type\PathInterface[]
     */
    public function values()
    {
        return $this->values;
    }

    /**
     * {@inheritdoc}
     */
    public function hasValues()
    {
        return !empty($this->values);
    }

    /**
     * @param string $key
     *
     * @return mixed|\GraphAware\Common\Type\NodeInterface|\GraphAware\Common\Type\RelationshipInterface|\GraphAware\Common\Type\PathInterface|
     */
    public function value($key)
    {
        if (!array_key_exists($key, $this->values)) {
            throw new \InvalidArgumentException(sprintf('No value with key "%s" in RecordView, possible keys are %s', $key, json_encode($this->keys)));
        }

        return $this->values[$key];
    }

    /**
     * @param $index
     *
     * @return mixed|\GraphAware\Common\Type\NodeInterface|\GraphAware\Common\Type\RelationshipInterface|\GraphAware\Common\Type\PathInterface
     */
    public function valueByIndex($index)
    {
        if (!array_key_exists($index, $this->indexMap)) {
            throw new \InvalidArgumentException(sprintf('No value with index "%d" in RecordView, possible indexes are %s', $index, json_encode($this->keys)));
        }

        return $this->values[$this->indexMap[$index]];
    }

    /**
     * @return \GraphAware\Common\Result\AbstractRecordView
     */
    public function record()
    {
        return clone $this;
    }
}
