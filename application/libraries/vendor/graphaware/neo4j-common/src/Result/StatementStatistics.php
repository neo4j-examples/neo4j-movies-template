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

class StatementStatistics implements StatementStatisticsInterface
{
    /**
     * @var int
     */
    protected $nodesCreated = 0;

    /**
     * @var int
     */
    protected $nodesDeleted = 0;

    /**
     * @var int
     */
    protected $relationshipsCreated = 0;

    /**
     * @var int
     */
    protected $relationshipsDeleted = 0;

    /**
     * @var int
     */
    protected $propertiesSet = 0;

    /**
     * @var int
     */
    protected $labelsAdded = 0;

    /**
     * @var int
     */
    protected $labelsRemoved = 0;

    /**
     * @var int
     */
    protected $indexesAdded = 0;

    /**
     * @var int
     */
    protected $indexesRemoved = 0;

    /**
     * @var int
     */
    protected $constraintsAdded = 0;

    /**
     * @var int
     */
    protected $constraintsRemoved = 0;

    /**
     * @var bool
     */
    protected $containsUpdates = false;

    /**
     * @param array $statistics
     */
    public function __construct(array $statistics = array())
    {
        $keys = [
            'contains_updates', 'nodes_created', 'nodes_deleted', 'properties_set', 'labels_added', 'labels_removed',
            'indexes_added', 'indexes_removed', 'constraints_added', 'constraints_removed', 'relationships_deleted',
            'relationships_created',
        ];

        foreach ($statistics as $key => $value) {
            if (!in_array($key, $keys)) {
                throw new \InvalidArgumentException(sprintf('Key %s is invalid in statement statistics', $key));
            }
            $k = $this->toCamelCase($key);
            $this->$k = $value;
        }

        foreach ($statistics as $stat => $value) {
            if ($stat !== 'contains_updates' && $value > 0) {
                $this->containsUpdates = true;
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public function containsUpdates()
    {
        return (bool) $this->containsUpdates;
    }

    /**
     * {@inheritdoc}
     */
    public function nodesCreated()
    {
        return $this->nodesCreated;
    }

    /**
     * {@inheritdoc}
     */
    public function nodesDeleted()
    {
        return $this->nodesDeleted;
    }

    /**
     * {@inheritdoc}
     */
    public function relationshipsCreated()
    {
        return $this->relationshipsCreated;
    }

    /**
     * {@inheritdoc}
     */
    public function relationshipsDeleted()
    {
        return $this->relationshipsDeleted;
    }

    /**
     * {@inheritdoc}
     */
    public function propertiesSet()
    {
        return $this->propertiesSet;
    }

    /**
     * {@inheritdoc}
     */
    public function labelsAdded()
    {
        return $this->labelsAdded;
    }

    /**
     * {@inheritdoc}
     */
    public function labelsRemoved()
    {
        return $this->labelsRemoved;
    }

    /**
     * {@inheritdoc}
     */
    public function indexesAdded()
    {
        return $this->indexesAdded;
    }

    /**
     * {@inheritdoc}
     */
    public function indexesRemoved()
    {
        return $this->labelsRemoved;
    }

    /**
     * {@inheritdoc}
     */
    public function constraintsAdded()
    {
        return $this->constraintsAdded;
    }

    /**
     * {@inheritdoc}
     */
    public function constraintsRemoved()
    {
        return $this->constraintsRemoved;
    }

    /**
     * @param string $key
     *
     * @return string
     */
    private function toCamelCase($key)
    {
        list($start, $end) = explode('_', $key);
        $str = strtolower($start).ucfirst($end);

        return $str;
    }
}
