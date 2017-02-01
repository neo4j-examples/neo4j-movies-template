<?php

namespace GraphAware\Bolt\Result;

use GraphAware\Common\Cypher\StatementInterface;
use GraphAware\Common\Result\StatementStatistics;
use GraphAware\Common\Result\ResultSummaryInterface;

class ResultSummary implements ResultSummaryInterface
{
    /**
     * @var \GraphAware\Common\Cypher\StatementInterface $statement
     */
    protected $statement;

    /**
     * @var |GraphAware\Common\Result\StatementStatistics|null
     */
    protected $updateStatistics;

    /**
     * @param \GraphAware\Common\Cypher\StatementInterface $statement
     */
    public function __construct(StatementInterface $statement)
    {
        $this->statement = $statement;
    }

    /**
     * @return \GraphAware\Common\Cypher\StatementInterface $statement
     */
    public function statement()
    {
        return $this->statement;
    }

    /**
     * @return |GraphAware\Common\Result\StatementStatistics|null
     */
    public function updateStatistics()
    {
        return $this->updateStatistics;
    }

    public function statementType()
    {
        return $this->statement->getType();
    }


    /**
     * @param array $stats
     */
    public function setStatistics(array $stats)
    {
        // Difference between http format and binary format of statistics
        foreach ($stats as $k => $v) {
            $nk = str_replace('-', '_', $k);
            $stats[$nk] = $v;
            unset($stats[$k]);
        }
        $this->updateStatistics = new StatementStatistics($stats);
    }

    public function notifications()
    {
        // TODO: Implement notifications() method.
    }
}