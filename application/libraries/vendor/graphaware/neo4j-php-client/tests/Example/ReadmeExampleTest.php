<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\Tests\Example;

class ReadmeExamleTest extends ExampleTestCase
{
    public function testReadingAResult()
    {
        $this->emptyDB();
        $this->client->run("CREATE (n:Person {name: {name} })
        CREATE (n2:Person {name: {friend_name} })
        CREATE (n)-[:FOLLOWS]->(n2)", [
            'name' => 'Chris',
            'friend_name' => 'Ales'
        ]);

        $result = $this->client->run("MATCH (n:Person)-[:FOLLOWS]->(friend) RETURN n.name as name, collect(friend) as friends");
        $this->assertCount(1, $result->records());

        $record = $result->firstRecord();
        $this->assertEquals('Chris', $record->value('name'));
        $this->assertCount(1, $record->value('friends'));
        $this->assertEquals('Ales', $record->get('friends')[0]->get('name'));
    }
}