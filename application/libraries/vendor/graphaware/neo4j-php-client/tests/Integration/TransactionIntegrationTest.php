<?php

namespace GraphAware\Neo4j\Client\Tests\Integration;

use GraphAware\Bolt\Exception\MessageFailureException;
use GraphAware\Neo4j\Client\Exception\Neo4jException;
use GraphAware\Neo4j\Client\Exception\Neo4jExceptionInterface;
use GraphAware\Neo4j\Client\HttpDriver\Transaction;

/**
 * Class TransactionIntegrationTest
 * @package GraphAware\Neo4j\Client\Tests\Integration
 *
 * @group tx-it
 */
class TransactionIntegrationTest extends IntegrationTestCase
{
    public function testTransactionIsCommittedWithHttp()
    {
        $this->emptyDb();
        $tx = $this->client->transaction('http');
        $result = $tx->run('CREATE (n:Test) RETURN id(n) as id');
        $this->assertTrue($result->summarize()->updateStatistics()->containsUpdates());
        $this->assertEquals(Transaction::OPENED, $tx->status());
        $tx->commit();
        $this->assertEquals(Transaction::COMMITED, $tx->status());
        $this->assertXNodesWithLabelExist('Test');
    }

    public function testTransactionIsRolledBackWithHttp()
    {
        $this->emptyDb();
        $tx = $this->client->transaction('http');
        $result = $tx->run('CREATE (n:Test) RETURN id(n) as id');
        $this->assertTrue($result->summarize()->updateStatistics()->containsUpdates());
        $this->assertEquals(Transaction::OPENED, $tx->status());
        $tx->rollback();
        $this->assertEquals(Transaction::ROLLED_BACK, $tx->status());
        $this->assertXNodesWithLabelExist('Test', 0);
    }

    public function testTransactionIsRolledBackInCaseOfException()
    {
        $this->emptyDb();
        $tx = $this->client->transaction('http');
        try {
            $result = $tx->run('CREATE (n:Test) RETURN x');
            $this->assertEquals(1, 2); // If we reached here then there is a bug
        } catch (Neo4jException $e) {
            $this->assertEquals(Neo4jExceptionInterface::EFFECT_ROLLBACK, $e->effect());
        }
        $this->assertEquals(Transaction::ROLLED_BACK, $tx->status());
        $this->assertXNodesWithLabelExist('Test', 0);
    }

    public function testPushShouldStackUntilCommit()
    {
        $this->emptyDb();
        $tx = $this->client->transaction('http');
        $tx->push('CREATE (n:Test)');
        $this->assertNotContains($tx->status(), [Transaction::COMMITED, Transaction::ROLLED_BACK, Transaction::OPENED]);
        $this->assertXNodesWithLabelExist('Test', 0);
        $tx->push('CREATE (n:Test)');
        $this->assertXNodesWithLabelExist('Test', 0);
        $tx->commit();
        $this->assertXNodesWithLabelExist('Test', 2);
        $this->assertEquals(Transaction::COMMITED, $tx->status());
    }

    public function testTransactionIsCommittedWithBolt()
    {
        $this->emptyDb();
        $tx = $this->client->transaction('bolt');
        $result = $tx->run('CREATE (n:Test) RETURN id(n) as id');
        $this->assertTrue($result->summarize()->updateStatistics()->containsUpdates());
        //$this->assertEquals(Transaction::OPENED, $tx->status());
        $tx->commit();
        //$this->assertEquals(Transaction::COMMITED, $tx->status());
        $this->assertXNodesWithLabelExist('Test');
    }

    public function testTransactionIsRolledBackWithBolt()
    {
        $this->emptyDb();
        $tx = $this->client->transaction('bolt');
        $result = $tx->run('CREATE (n:Test) RETURN id(n) as id');
        $this->assertTrue($result->summarize()->updateStatistics()->containsUpdates());
        //$this->assertEquals(Transaction::OPENED, $tx->status());
        $tx->rollback();
        //$this->assertEquals(Transaction::ROLLED_BACK, $tx->status());
        $this->assertXNodesWithLabelExist('Test', 0);
    }

    public function testTransactionIsRolledBackInCaseOfExceptionWithBolt()
    {
        $this->emptyDb();
        $tx = $this->client->transaction('bolt');
        try {
            $result = $tx->run('CREATE (n:Test) RETURN x');
            $this->assertEquals(1, 2); // If we reached here then there is a bug
        } catch (MessageFailureException $e) {
            $this->assertEquals(1,1);
        }
        //$this->assertEquals(Transaction::ROLLED_BACK, $tx->status());
        $this->assertXNodesWithLabelExist('Test', 0);
    }

    public function testPushShouldStackUntilCommitWithBolt()
    {
        $this->emptyDb();
        $tx = $this->client->transaction('bolt');
        $tx->push('CREATE (n:Test)');
        $this->assertNotContains($tx->status(), [Transaction::COMMITED, Transaction::ROLLED_BACK, Transaction::OPENED]);
        $this->assertXNodesWithLabelExist('Test', 0);
        $tx->push('CREATE (n:Test)');
        $this->assertXNodesWithLabelExist('Test', 0);
        $tx->commit();
        $this->assertXNodesWithLabelExist('Test', 2);
        //$this->assertEquals(Transaction::COMMITED, $tx->status());
    }

    private function assertXNodesWithLabelExist($label, $number = 1)
    {
        $query = 'MATCH (n:' . $label . ') RETURN count(n) as c';
        $result = $this->client->run($query, null, null, 'http');

        $this->assertNotNull($result->firstRecord());
        $this->assertEquals($number, $result->firstRecord()->get('c'));
    }
}