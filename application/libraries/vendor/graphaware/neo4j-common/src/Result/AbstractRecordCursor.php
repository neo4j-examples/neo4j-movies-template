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

use GraphAware\Common\Cypher\StatementInterface;

abstract class AbstractRecordCursor implements RecordCursorInterface
{
    /**
     * @var \GraphAware\Common\Cypher\StatementInterface
     */
    protected $statement;

    /**
     * @var array
     */
    protected $records = [];

    /**
     * @var ResultSummaryInterface
     */
    protected $resultSummary;

    /**
     * @var bool
     */
    protected $isOpen = true;

    /**
     * @var int
     */
    protected $position = -1;

    /**
     * {@inheritdoc}
     */
    public function __construct(StatementInterface $statement)
    {
        $this->statement = $statement;
    }

    /**
     * {@inheritdoc}
     */
    public function statement()
    {
        return $this->statement;
    }

    /**
     * @param RecordViewInterface $record
     */
    public function addRecord(RecordViewInterface $record)
    {
        $this->records[] = $record;
    }

    /**
     * {@inheritdoc}
     */
    public function records()
    {
        return $this->records;
    }

    /**
     * @param ResultSummaryInterface $resultSummary
     */
    public function setResultSummary(ResultSummaryInterface $resultSummary)
    {
        $this->resultSummary = $resultSummary;
    }

    /**
     * {@inheritdoc}
     */
    public function summarize()
    {
        return $this->resultSummary;
    }

    /**
     * {@inheritdoc}
     */
    public function hasSummary()
    {
        return $this->resultSummary instanceof ResultSummaryInterface;
    }

    /**
     * {@inheritdoc}
     */
    public function isOpen()
    {
        return $this->isOpen;
    }

    /**
     * {@inheritdoc}
     */
    public function close()
    {
        $this->isOpen = false;
    }

    /**
     * @return bool
     */
    public function next()
    {
        if (false !== current($this->records)) {
            ++$this->position;

            return true;
        }

        return false;
    }

    /**
     * @return bool
     */
    public function first()
    {
        return -1 === $this->position && $this->next() ? true : false;
    }

    /**
     * @return bool
     */
    public function single()
    {
        return $this->first() && $this->isLast();
    }

    /**
     * @return bool
     */
    public function last()
    {
        while ($this->next()) {
        }

        return $this->position !== -1;
    }

    /**
     * @return bool
     */
    public function isLast()
    {
        return $this->position === count($this->records) - 1;
    }
}
