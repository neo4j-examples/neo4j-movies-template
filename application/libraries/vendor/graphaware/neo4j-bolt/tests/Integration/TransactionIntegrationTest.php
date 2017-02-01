<?php

namespace GraphAware\Bolt\Tests\Integration;

use GraphAware\Common\Cypher\Statement;

/**
 * Class TransactionIntegrationTest
 * @package GraphAware\Bolt\Tests\Integration
 *
 * @group tx-it
 */
class TransactionIntegrationTest extends IntegrationTestCase
{
    public function testRunMultiple()
    {
        $this->emptyDB();
        $statements = array();
        for ($i = 0; $i < 5; ++$i) {
            $statements[] = Statement::create('CREATE (n:Test)');
        }

        $session = $this->driver->session();
        $tx = $session->transaction();
        $tx->begin();
        $tx->runMultiple($statements);
        $tx->commit();
        $this->assertXNodesWithTestLabelExist(5);
    }

    private function assertXNodesWithTestLabelExist($number = 1)
    {
        $session = $this->driver->session();
        $result = $session->run("MATCH (n:Test) RETURN count(n) as c");

        $this->assertEquals($number, $result->firstRecord()->get('c'));
    }
}