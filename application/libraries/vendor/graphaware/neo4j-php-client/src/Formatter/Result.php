<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\Formatter;

use GraphAware\Common\Result\AbstractRecordCursor;
use GraphAware\Neo4j\Client\Formatter\Type\Node;
use GraphAware\Neo4j\Client\Formatter\Type\Path;
use GraphAware\Neo4j\Client\Formatter\Type\Relationship;
use GraphAware\Common\Cypher\StatementInterface;
use GraphAware\Neo4j\Client\HttpDriver\Result\ResultSummary;
use GraphAware\Neo4j\Client\HttpDriver\Result\StatementStatistics;

class Result extends AbstractRecordCursor
{
    /**
     * @var \GraphAware\Common\Result\RecordViewInterface[]
     */
    protected $records = [];

    /**
     * @var string[]
     */
    protected $fields = [];

    /**
     * @var \GraphAware\Neo4j\Client\HttpDriver\Result\ResultSummary
     */
    protected $resultSummary;

    /**
     * @var array
     */
    private $graph;

    public function __construct(StatementInterface $statement)
    {
        $this->resultSummary = new ResultSummary($statement);
        parent::__construct($statement);
    }

    /**
     * @param array $fields
     */
    public function setFields(array $fields)
    {
        $this->fields = $fields;
    }

    /**
     * @param array $graph
     */
    public function setGraph(array $graph)
    {
        $this->graph = $graph;
    }

    public function pushRecord($data, $graph)
    {
        $mapped = $this->array_map_deep($data, $graph);
        $this->records[] = new RecordView($this->fields, $mapped);
    }

    public function setStats(array $stats)
    {
        $this->resultSummary->setStatistics(new StatementStatistics($stats));
    }

    /**
     * @return \GraphAware\Common\Result\RecordViewInterface[]
     */
    public function getRecords()
    {
        return $this->records;
    }

    /**
     * @return \GraphAware\Common\Result\RecordViewInterface|null
     */
    public function getRecord()
    {
        return !empty($this->records) ? $this->records[0] : null;
    }

    /**
     * @return bool
     */
    public function hasRecord()
    {
        return !empty($this->records);
    }

    /**
     * @return int
     */
    public function size()
    {
        return count($this->records);
    }

    /**
     * @return \GraphAware\Common\Result\RecordViewInterface|null
     */
    public function firstRecord()
    {
        if (!empty($this->records)) {
            return $this->records[0];
        }

        return null;
    }

    private function array_map_deep(array $array, array $graph)
    {
        foreach ($array as $k => $v) {
            if (is_array($v)) {
                if (array_key_exists('metadata', $v) && isset($v['metadata']['labels'])) {
                    $array[$k] = new Node($v['metadata']['id'], $v['metadata']['labels'], $v['data']);
                } elseif (array_key_exists('start', $v) && array_key_exists('type', $v)) {
                    $array[$k] = new Relationship(
                        $v['metadata']['id'],
                        $v['type'],
                        $this->extractIdFromRestUrl($v['start']),
                        $this->extractIdFromRestUrl($v['end']),
                        $v['data']
                        );
                } elseif(array_key_exists('length', $v) && array_key_exists('relationships', $v) && array_key_exists('nodes', $v)) {
                    $array[$k] = new Path(
                        $this->getNodesFromPathMetadata($v, $graph),
                        $this->getRelationshipsFromPathMetadata($v, $graph)
                    );
                } else {
                    $array[$k] = $this->array_map_deep($v, $graph);
                }
            }
        }

        return $array;
    }

    private function extractIdFromRestUrl($url)
    {
        $expl = explode('/', $url);
        $v = $expl[count($expl)-1];

        return (int) $v;
    }

    private function getRelationshipsFromPathMetadata(array $metadata, array $graph)
    {
        $rels = [];

        foreach ($metadata['relationships'] as $relationship) {
            $relId = $this->extractIdFromRestUrl($relationship);
            foreach ($graph['relationships'] as $grel) {
                $grid = (int) $grel['id'];
                if ($grid === $relId) {
                    $rels[$grid] = new Relationship(
                        $grel['id'],
                        $grel['type'],
                        $grel['startNode'],
                        $grel['endNode'],
                        $grel['properties']
                    );
                }
            }
        }

        return array_values($rels);
    }

    private function getNodesFromPathMetadata(array $metadata, array $graph)
    {
        $nodes = [];
        foreach ($metadata['nodes'] as $node) {
            $nodeId = $this->extractIdFromRestUrl($node);
            foreach ($graph['nodes'] as $gn) {
                $gnid = (int) $gn['id'];
                if ($gnid === $nodeId) {
                    $nodes[$nodeId] = new Node(
                        $gn['id'],
                        $gn['labels'],
                        $gn['properties']
                    );
                }
            }
        }

        return array_values($nodes);
    }
}
