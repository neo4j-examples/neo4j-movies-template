<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\HttpDriver\Result;

use GraphAware\Common\Result\StatementStatisticsInterface;

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
    protected $relationshipDeleted = 0;

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
            'indexes_added', 'indexes_removed', 'constraints_added', 'constraints_removed', 'relationship_deleted',
            'relationships_created'
        ];

        foreach ($statistics as $key => $value) {
            if (!in_array($key, $keys)) {
                throw new \InvalidArgumentException(sprintf('Key %s is invalid in statement statistics', $key));
            }
            $k = $this->toCamelCase($key);
            $this->$k = $value;
        }
    }

    /**
     * @return bool
     */
    public function containsUpdates()
    {
        return (bool) $this->containsUpdates;
    }

    /**
     * @return int
     */
    public function nodesCreated()
    {
        return $this->nodesCreated;
    }

    /**
     * @return int
     */
    public function nodesDeleted()
    {
        return $this->nodesDeleted;
    }

    /**
     * @return int
     */
    public function relationshipsCreated()
    {
        return $this->relationshipsCreated;
    }

    /**
     * @return int
     */
    public function relationshipsDeleted()
    {
        return $this->relationshipDeleted;
    }

    /**
     * @return int
     */
    public function propertiesSet()
    {
        return $this->propertiesSet;
    }

    /**
     * @return int
     */
    public function labelsAdded()
    {
        return $this->labelsAdded;
    }

    /**
     * @return int
     */
    public function labelsRemoved()
    {
        return $this->labelsRemoved;
    }

    /**
     * @return int
     */
    public function indexesAdded()
    {
        return $this->indexesAdded;
    }

    /**
     * @return int
     */
    public function indexesRemoved()
    {
        return $this->labelsRemoved;
    }

    /**
     * @return int
     */
    public function constraintsAdded()
    {
        return $this->constraintsAdded;
    }

    /**
     * @return int
     */
    public function constraintsRemoved()
    {
        return $this->constraintsRemoved;
    }

    /**
     * @param $key
     * @return string
     */
    private function toCamelCase($key)
    {
        list($start, $end) = explode('_', $key);
        $str = strtolower($start) . ucfirst($end);

        return $str;
    }

}