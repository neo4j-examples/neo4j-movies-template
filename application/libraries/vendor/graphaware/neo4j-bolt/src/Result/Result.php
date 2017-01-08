<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Result;

use GraphAware\Bolt\PackStream\Structure\Structure;
use GraphAware\Bolt\Record\RecordView;
use GraphAware\Bolt\Result\Type\Node;
use GraphAware\Bolt\Result\Type\Path;
use GraphAware\Bolt\Result\Type\Relationship;
use GraphAware\Bolt\Result\Type\UnboundRelationship;
use GraphAware\Common\Cypher\StatementInterface;
use GraphAware\Common\Result\AbstractRecordCursor;

class Result extends AbstractRecordCursor
{
    /**
     * @var \GraphAware\Common\Result\RecordViewInterface[]
     */
    protected $records = [];

    /**
     * @var array
     */
    protected $fields;

    /**
     * Result constructor.
     * @param \GraphAware\Common\Cypher\StatementInterface $statement
     */
    public function __construct(StatementInterface $statement)
    {
        $this->resultSummary = new ResultSummary($statement);
        return parent::__construct($statement);
    }

    /**
     * @param \GraphAware\Bolt\PackStream\Structure\Structure $structure
     */
    public function pushRecord(Structure $structure)
    {
        $elts = $this->array_map_deep($structure->getElements());
        $this->records[] = new RecordView($this->fields, $elts);
    }

    /**
     * @return \GraphAware\Common\Result\RecordViewInterface[]
     */
    public function getRecords()
    {
        return $this->records;
    }

    /**
     * @return \GraphAware\Bolt\Record\RecordView
     */
    public function getRecord()
    {
        if (count($this->records) < 1) {
            throw new \InvalidArgumentException('No records');
        }

        return $this->records[0];
    }

    /**
     * @param array $fields
     */
    public function setFields(array $fields)
    {
        $this->fields = $fields['fields'];
    }

    /**
     * @param array $stats
     */
    public function setStatistics(array $stats)
    {
        $this->resultSummary->setStatistics($stats);
    }

    /**
     * @param $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return \GraphAware\Bolt\Result\ResultSummary
     */
    public function summarize()
    {
        return $this->resultSummary;
    }

    public function position()
    {
        // TODO: Implement position() method.
    }

    public function skip()
    {
        // TODO: Implement skip() method.
    }

    private function array_map_deep(array $array)
    {
        foreach ($array as $k => $v) {

            if ($v instanceof Structure && $v->getSignature() === 'NODE') {
                $elts= $v->getElements();
                $array[$k] = new Node($elts[0], $elts[1], $elts[2]);
            } elseif ($v instanceof Structure && $v->getSignature() === 'RELATIONSHIP') {
                $elts = $v->getElements();
                $array[$k] = new Relationship($elts[0], $elts[1], $elts[2], $elts[3], $elts[4]);
            } elseif ($v instanceof Structure && $v->getSignature() === 'UNBOUND_RELATIONSHIP') {
                $elts = $v->getElements();
                $array[$k] = new UnboundRelationship($elts[0], $elts[1], $elts[2]);
            } elseif ($v instanceof Structure && $v->getSignature() === 'PATH') {
                $elts = $v->getElements();
                $array[$k] = new Path($this->array_map_deep($elts[0]), $this->array_map_deep($elts[1]), $this->array_map_deep($elts[2]));
            } elseif ($v instanceof Structure) {
                $array[$k] = $this->array_map_deep($v->getElements());
            } elseif (is_array($v)) {
                $array[$k] = $this->array_map_deep($v);
            }
        }


        return $array;
    }

    public function size()
    {
        return count($this->records);
    }

    public function firstRecord()
    {
        if (!empty($this->records)) {
            return $this->records[0];
        }

        return null;
    }
}