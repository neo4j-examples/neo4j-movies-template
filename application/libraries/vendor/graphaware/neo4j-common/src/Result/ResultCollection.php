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

class ResultCollection implements \Iterator
{
    /**
     * @var int
     */
    protected $position = 0;

    /**
     * @var RecordCursorInterface[]
     */
    protected $results = [];

    /**
     * @var array
     */
    protected $tagMap = [];

    /**
     * Add a Result <code>RecordCursorInterface</code> to the ResultCollection.
     *
     * @param RecordCursorInterface $recordCursor
     * @param null|string           $tag
     */
    public function add(RecordCursorInterface $recordCursor, $tag = null)
    {
        $this->results[] = $recordCursor;

        if (null !== $tag) {
            $this->tagMap[$tag] = count($this->results) - 1;
        } elseif ($recordCursor->statement()->hasTag()) {
            $this->tagMap[$recordCursor->statement()->getTag()] = count($this->results()) - 1;
        }
    }

    /**
     * Returns a RecordCursorInterface (Result) for the given tag (tag passed along with the Cypher statement).
     *
     * @param string $tag
     * @param mixed  $default
     *
     * @return RecordCursorInterface|null
     */
    public function get($tag, $default = null)
    {
        if (array_key_exists($tag, $this->tagMap)) {
            return $this->results[$this->tagMap[$tag]];
        }

        if (2 === func_num_args()) {
            return $default;
        }

        throw new \InvalidArgumentException(sprintf('This result collection does not contains a Result for tag "%s"', $tag));
    }

    /**
     * @param $tag
     *
     * @return bool
     */
    public function contains($tag)
    {
        return array_key_exists($tag, $this->tagMap);
    }

    /**
     * @return RecordCursorInterface[]
     */
    public function results()
    {
        return $this->results;
    }

    /**
     * Returns the size of the results of this ResultCollection.
     *
     * @return int
     */
    public function size()
    {
        return count($this->results);
    }

    /**
     * {@inheritdoc}
     */
    public function rewind()
    {
        $this->position = 0;
    }

    /**
     * @return RecordCursorInterface
     */
    public function current()
    {
        return $this->results[$this->position];
    }

    /**
     * {@inheritdoc}
     */
    public function key()
    {
        return $this->position;
    }

    /**
     * {@inheritdoc}
     */
    public function next()
    {
        ++$this->position;
    }

    /**
     * {@inheritdoc}
     */
    public function valid()
    {
        return isset($this->results[$this->position]);
    }

    /**
     * @return CombinedStatistics
     */
    public function updateStatistics()
    {
        $combinedStats = new CombinedStatistics();

        foreach ($this->results as $result) {
            $combinedStats->mergeStats($result->summarize()->updateStatistics());
        }

        return $combinedStats;
    }
}
