# GraphAware PHP Neo4j Common

## Library with common utility classes for Neo4j

[![Build Status](https://travis-ci.org/graphaware/neo4j-php-commons.svg)](https://travis-ci.org/graphaware/neo4j-php-commons)
[![Latest Stable Version](https://poser.pugx.org/graphaware/neo4j-common/version)](https://packagist.org/packages/graphaware/neo4j-common)

### Installation

Require the dependencies in your application :

```bash
composer require graphaware/neo4j-common
```

---

### Graph

#### Label

Object representation of a Node Label.

```php

use GraphAware\Common\Graph\Label;

$label = new Label("User");
echo $label->getName(); // Returns (string) "User"

// or static construction

$label = Label::label("User");
```

#### Node

Object Representation of a Node. The node object extends `PropertyBag`.

```php

use GraphAware\Common\Graph\Node;

$node = new Node(1, array("User", "Person"));
$node->getId(); // Returns (int) 1
$node->getLabels(); // Returns an array of \GraphAware\Common\Graph\Label objects
```

#### Relationship

Object Representation of a Relationship. The relationship object extends `PropertyBag`.

```php
use GraphAware\Common\Graph\Relationship;

$rel = new Relationship(1, RelationshipType::withName("RELATES"), $node, $node2);
echo $rel->getType(); // Returns (string) "RELATES"
var_dump($rel->isType(RelationshipType::withName("RELATES"))); // Returns (bool) true
```

#### Direction (Enum) : representation of a Relationship Direction

```php

use GraphAware\Common\Graph\Direction;

$direction = new Direction(Direction::INCOMING);
echo $direction; // Returns (string) "INCOMING"

// Or static call construction

$direction = Direction::OUTGOING;
echo $direction; // Returns (string) "OUTGOING"
```

Valid values are `INCOMING`, `OUTGOING` and `BOTH`.

#### RelationshipType

Object representation of a relationship type.

```php
use GraphAware\Common\Graph\RelationshipType;

$relType = RelationshipType::withName("FOLLOWS");
echo $relType->getName(); // Returns (string) "FOLLOWS"
echo (string) $relType; // implements __toString method : Returns (string) "FOLLOWS"
```
---

### Cypher

#### Statement and StatementCollection

Utility classes representing Cypher's statements. Both `Statement` and `StatementCollection` classes are 
`taggable`.

Contains also `StatementInterface` and `StatementCollectionInterface` used in most GraphAware's PHP libraries.

##### Statement

Represents a Cypher statement with a query and an array of parameters. Also the Statement accepts a `tag` argument default to null;

```php

use GraphAware\Common\Cypher\Statement;

$statement = Statement::create("MATCH (n) WHERE id(n) = {id} RETURN n", array("id" => 324));

echo $statement->getQuery(); // Returns (string) "MATCH (n) WHERE id(n) = {id} RETURN n"
echo count($statement->getParameters()); // Returns (int) 1
```

##### StatementCollection

Represents a collection of `Statement` objects. Is also Taggable.

```php

use GraphAware\Common\Cypher\Statement
    GraphAware\Common\Cypher\StatementCollection;

$collection = new StatementCollection();
$collection->add(Statement::create("MATCH (n) RETURN count(n)"));

print_r($collection->getStatements());
echo $collection->isEmpty();
```

---

## License

### Apache License 2.0

```
Copyright 2015 Graphaware Limited

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

--- 

## Support

Standard Community Support through the Github Issues and PR's workflow.

Enterprise support via your first level support contact.