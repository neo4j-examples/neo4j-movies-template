# GraphAware Neo4j PHP Client

## An Enterprise Grade Client for Neo4j

[![Build Status](https://travis-ci.org/graphaware/neo4j-php-client.svg?branch=master)](https://travis-ci.org/graphaware/neo4j-php-client)
[![Latest Stable Version](https://poser.pugx.org/graphaware/neo4j-php-client/v/stable.svg)](https://packagist.org/packages/graphaware/neo4j-php-client)
[![Total Downloads](https://poser.pugx.org/neoxygen/neoclient/downloads.svg)](https://packagist.org/packages/neoxygen/neoclient)
[![License](https://poser.pugx.org/neoxygen/neoclient/license.svg)](https://packagist.org/packages/graphaware/neo4j-php-client)

## Introduction

Neo4j-PHP-Client is the most advanced and flexible [Neo4j](http://neo4j.com) Client for PHP. 

### What is Neo4j?

Neo4j is a transactional, open-source graph database. A graph database manages data in a connected data structure, capable of representing any kind of data in a very accessible way. Information is stored in nodes and relationships connecting them, both of which can have arbitrary properties. To learn more visit [What is a Graph Database](http://neo4j.com/developer/graph-database/)?

### Key features

* Supports multiple connections
* Support for Bolt binary protocol
* Built-in and automatic support for *Neo4j Enterprise HA Master-Slave Mode* with auto slaves fallback

#### Neo4j Version Support

| **Version** | **Tested**  |
|-------------|-------------|
| <= 2.2.6    |   No        |
| >= 2.2.6    |   Yes       |
| 2.2         |   Yes       |
| 2.3         |   Yes       |

#### Neo4j Feature Support

| **Feature**          | **Supported?** |
|----------------------|----------------|
| Auth                 |  Yes           |
| Remote Cypher        |  Yes           |
| Transactions         |  Yes           |
| High Availability    |  Yes           |
| Embedded JVM support |  No            |
| Binary Protocol      |  Yes           |

### Requirements

* PHP >= 5.6
* A Neo4j database (minimum version 2.2.6)

### Getting Help

You can:

 * [Ask a question on StackOverflow](http://stackoverflow.com/questions/ask?tags=graphaware,php,neo4j)
 * For bugs, please feel free to create a [new issue on GitHub](https://github.com/graphaware/neo4j-php-client/issues/new)
 
## Installation and basic usage

### Installation

Add the library to your composer dependencies :

```bash
composer require graphaware/neo4j-php-client:^4.0@alpha
```

Require the composer autoloader, configure your connection by providing a connection alias and your connection settings :

```php
<?php

require_once 'vendor/autoload.php';

use GraphAware\Neo4j\Client\ClientBuilder;

$client = ClientBuilder::create()
    ->addConnection('default', 'http://neo4j:password@localhost:7474') // Example for HTTP connection configuration (port is optional)
    ->addConnection('bolt', 'bolt://neo4j:password@localhost:7687') // Example for BOLT connection configuration (port is optional)
    ->build();
```

You're now ready to connect to your database.

NB: The build method will process configuration settings and return you a `Client` instance.

### Basic Usage

#### Sending a Cypher Query

```php
$client->run("CREATE (n:Person)");
```

#### Sending a Cypher Query with parameters

```php
$client->run("CREATE (n:Person) SET n += {infos}", ['infos' => ['name' => 'Ales', 'age' => 34]]);
```

#### Reading a Result

```php
$result = $client->run("MATCH (n:Person) RETURN n");
// a result contains always a collection (array) of Record objects

// get all records
$records = $result->getRecords();

// get the first or (if expected only one) the only record

$record = $result->getRecord();
```

A `Record` object contains the values of one record from your Cypher query :

```php
$query = "MATCH (n:Person)-[:FOLLOWS]->(friend) RETURN n.name, collect(friend) as friends";
$result = $client->run($query);

foreach ($result->getRecords() as $record) {
    echo sprintf('Person name is : %s and has %d number of friends', $record->value('name'), count($record->value('friends'));
}
```

### Cypher statements and Stacks

Ideally, you would stack your statements and issue them all at once in order to improve performance.

You can create Cypher statement stacks that act as a Bag and run this stack with the client, example :

```php

$stack = $client->stack();

$stack->push('CREATE (n:Person {uuid: {uuid} })', ['uuid' => '123-fff']);
$stack->push('MATCH (n:Person {uuid: {uuid1} }), (n2:Person {uuid: {uuid2} }) MERGE (n)-[:FOLLOWS]->(n2)', ['uuid1' => '123-fff', 'uuid2' => '456-ddd']);

$results = $client->runStack($stack);
```

### Tagging your Cypher statements

Sometimes, you may want to retrieve a specific result from a Stack, an easy way to do this is to tag your Cypher statements.

The tag is passed via the 3rd argument of the `run` or `push` methods :

```php
$stack = $client->stack();

$stack->push('CREATE (n:Person {uuid: {uuid} })', ['uuid' => '123-fff'], 'user_create');
$stack->push('MATCH (n:Person {uuid: {uuid1} }), (n2:Person {uuid: {uuid2} }) MERGE (n)-[r:FOLLOWS]->(n2) RETURN id(r) as relId', ['uuid1' => '123-fff', 'uuid2' => '456-ddd'], 'user_follows');

$results = $client->runStack($stack);

$followResult = $results->get('user_follows');
$followRelationshipId = $followResult->getRecord()->value('relId');
```

### Working with Result sets


#### Basics

The `run` method returns you a single `Result` object. Other methods where you can expect multiple results returns a `ResultCollection` object which is Traversable.

The `Result` object contains the `records` and the `summary` of the statement, the following methods are available in the API :

```php

$result->firstRecord(); // Returns the first record of the Statement Result

$result->records(); // Returns all records

$result->summarize(); // Returns the ResultSummary
```

#### Summary

The `ResultSummary` contains the `Statement`, the Statistics and the QueryPlan if available :

```php
$summary = $result->summarize();

$query = $summary->statement()->text();

$stats = $summary->updateStatistics();

$nodesUpdated = $stats->nodesUpdated();
$propertiesSet = $stats->propertiesSet();

// Does the statement affected the graph ?
$affected = $stats->containsUpdates();
```

#### Record Values

Each record contains one row of values returned by the Cypher query :

```

$query = "MATCH (n:Person) n, n.name as name, n.age as age";
$result = $client->run($query);

foreach ($result->records() as $record) {
    print_r($record->get('n'); // nodes returned are automatically hydrated to Node objects

    echo $record->value('name') . PHP_EOL;
    echo $record->value('age') . PHP_EOL;
}
```

The client takes care of the hydration of Graph objects to PHP Objects, so it is for Node, Relationship and Path :

##### Node

* `labels()` : returns an array of labels (string)
* `identity()` : returns the internal ID of the node
* `values()` : returns the properties of the node (array)
* `value($key)` : returns the value for the given property key
* `hasValue($key)` : returns whether or not the nodes has a property with the given key
* `keys()` : returns you an array representing the keys of the node properties
* `hasLabel($label)` : returns whether or not the node has the given label (boolean)


##### Relationship

* `type()` : returns the relationship type
* `identity()` : returns the internal ID of the relationship
* `values()` : returns the properties of the relationship (array)
* `value($key)` : returns the value for the given property key
* `hasValue($key)` : returns whether or not the relationship has a property with the given key
* `keys()` : returns you an array representing the keys of the relationship properties
* `startNodeIdentity` : returns the start node id
* `endNodeIdentity` : returns the end node id

### Working with Transactions

The Client provides a Transaction object that ease how you would work with transactions.

#### Creating a Transaction

```php

$tx = $client->transaction();
```

At this stage, nothing has been sent to the server yet (the statement BEGIN has not been sent), this permits to stack queries or Stack objects before commiting them.

#### Stack a query

```
$tx->push("CREATE (n:Person) RETURN id(n)");
```

Again, until now nothing has been sent.

#### Run a query in a Transaction

Sometimes you want to get an immediate result of a statement inside the transaction, this can be done with the `run` method :

```php

$result = $tx->run("CREATE (n:Person) SET n.name = {name} RETURN id(n)", ['name' => 'Michal']);

echo $result->getRecord()->value("id(n)");
```

If the transaction has not yet begun, the BEGIN of the transaction will be done automatically.
```

#### You can also push or run Stacks

```php

$stack = $client->stack();
$stack->push('CREATE (n:Person {uuid: {uuid} })', ['uuid' => '123-fff']);
$stack->push('MATCH (n:Person {uuid: {uuid1} }), (n2:Person {uuid: {uuid2} }) MERGE (n)-[:FOLLOWS]->(n2)', ['uuid1' => '123-fff', 'uuid2' => '456-ddd']);

$tx->pushStack($stack);
// or
$results = $tx->runStack($stack);
```

### Commit and Rollback

if you have queued statements in your transaction (those added with the `push` methods) and you have finish your job, you can commit the transaction and receive
the results :

```php
$stack = $client->stack();
$stack->push('CREATE (n:Person {uuid: {uuid} })', ['uuid' => '123-fff']);
$stack->push('MATCH (n:Person {uuid: {uuid1} }), (n2:Person {uuid: {uuid2} }) MERGE (n)-[:FOLLOWS]->(n2)', ['uuid1' => '123-fff', 'uuid2' => '456-ddd']);

$tx->pushStack($stack);
$tx->pushQuery("MATCH (n) RETURN count(n)");

$results = $tx->commit();
```

After a commit, you will not be able to `push` or `run` statements in this transaction.

### Working with multiple connections

Generally speaking, you would better use HAProxy for running Neo4j in a cluster environment. However sometimes it makes sense to
have full control to which instance you send your statements.

Let's assume a environment with 3 neo4j nodes :

```php
$client = ClientBuilder::create()
    ->addConnection('node1', 'bolt://10.0.0.1')
    ->addConnection('node2', 'bolt://10.0.0.2')
    ->addConnection('node3', 'bolt://10.0.0.3')
    ->setMaster('node1')
    ->build();
```

By default, the `$client->run()` command will send your Cypher statements to the first registered connection in the list.

You can specify to which connection to send the statement by specifying its alias as 4th argument to the run parameter :

```php
$result = $client->run('CREATE (n) RETURN n', null, null, 'node1');
```

The client is also aware of the manually configured master connection, so sending your writes can be easier with :

```php
$client->runWrite('CREATE (n:User {login: 123})');
```

### Event Dispatching

3 types of events are dispatched during the `run` methods :

* `PreRunEvent` : before the statement or stack is run.
* `PostRunEvent` : after the statement or stack is run.
* `FailureEvent` : in case of failure, you can disable the client to throw an exception with this event.

##### Registering listeners

Example :

```php
$client = ClientBuilder::create()
    ->addConnection('default', 'bolt://localhost')
    ->registerEventListener(Neo4jClientEvents::NEO4J_PRE_RUN, array($listener, 'onPreRun')
    ->build();
```

The event dispatcher is available via the client with the `$client->getEventDispatcher` methods.

### Settings

#### Timeout

You can configure a global timeout for the connections :

```php
$client = ClientBuilder::create()
    ->addConnection('default', 'http://localhost:7474')
    ->setDefaultTimeout(3)
    ->build();
```

The timeout by default is 5 seconds.

### License

The library is released under the MIT License, refer to the LICENSE file bundled with this package.




