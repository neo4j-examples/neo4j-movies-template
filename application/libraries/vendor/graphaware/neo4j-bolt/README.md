## Neo4j Bolt PHP

PHP Driver for Neo4j's Bolt Remoting Protocol

[![Build Status](https://travis-ci.org/graphaware/neo4j-bolt-php.svg?branch=master)](https://travis-ci.org/graphaware/neo4j-bolt-php)

---

### DEV MODE

This library will remain in 1.0.0-dev version until stable release of Neo4j's Bolt.

---

### References :

* Documentation : http://remoting.neotechnology.com.s3-website-eu-west-1.amazonaws.com
* Python driver : https://github.com/neo4j/neo4j-python-driver
* Bolt How-To : https://github.com/nigelsmall/bolt-howto
* Java Driver : https://github.com/neo4j/neo4j-java-driver
* Neo4j 3.0-RC1 : http://neo4j.com

### Requirements:

* PHP5.6+
* Neo4j3.0
* PHP Sockets extension available

### Installation

Require the package in your dependencies :

```bash
composer require graphaware/neo4j-bolt
```

### Setting up a driver and creating a session

```php

use GraphAware\Bolt\GraphDatabase;

$driver = GraphDatabase::driver("bolt://localhost");
$session = $driver->session();
```

### Sending a Cypher statement

```php
$session = $driver->session();
$session->run("CREATE (n)");
$session->close();

// with parameters :

$session->run("CREATE (n) SET n += {props}", ['name' => 'Mike', 'age' => 27]);
```

### License

Copyright (c) 2015-2016 GraphAware Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---