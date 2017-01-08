<?php

use Behat\Behat\Tester\Exception\PendingException;
use Behat\Behat\Context\Context;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use PHPUnit_Framework_Assert as Assert;

/**
 * Defines application features from the specific context.
 */
class ChunkingDechunkingContext implements Context, SnippetAcceptingContext
{
    /**
     * @var \GraphAware\Bolt\Driver
     */
    protected $driver;

    /**
     * @var mixed
     */
    protected $value;

    /**
     * @var \GraphAware\Bolt\Result\Result;
     */
    protected $result;

    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct()
    {
        $this->driver = \GraphAware\Bolt\GraphDatabase::driver("bolt://localhost");
        $this->driver->session()->run("MATCH (n) DETACH DELETE n");
    }

    /**
     * @Given a String of size :arg1
     */
    public function aStringOfSize($arg1)
    {
        $this->value = str_repeat('a', $arg1);
    }

    /**
     * @When the driver asks the server to echo this value back
     */
    public function theDriverAsksTheServerToEchoThisValueBack()
    {
        $session = $this->driver->session();
        $this->result = $session->run("RETURN {value} as value", ['value' => $this->value]);
    }

    /**
     * @Then the result returned from the server should be a single record with a single value
     */
    public function theResultReturnedFromTheServerShouldBeASingleRecordWithASingleValue()
    {
        Assert::assertCount(1, $this->result->records());
        Assert::assertCount(1, $this->result->getRecord()->values());
    }

    /**
     * @Then the value given in the result should be the same as what was sent
     */
    public function theValueGivenInTheResultShouldBeTheSameAsWhatWasSent()
    {
        Assert::assertEquals($this->value, $this->result->getRecord()->value('value'));
    }

    /**
     * @Given a List of size :arg1 and type Null
     */
    public function aListOfSizeAndTypeNull($arg1)
    {
        $this->value = $this->buildList($arg1, null);
    }

    /**
     * @Given a List of size :arg1 and type Boolean
     */
    public function aListOfSizeAndTypeBoolean($arg1)
    {
        $this->value = $this->buildList($arg1, true);
    }

    /**
     * @Given a List of size :arg1 and type Integer
     */
    public function aListOfSizeAndTypeInteger($arg1)
    {
        $this->value = $this->buildList($arg1, 1);
    }

    /**
     * @Given a List of size :arg1 and type Float
     */
    public function aListOfSizeAndTypeFloat($arg1)
    {
        $this->value = $this->buildList($arg1, 1.1);
    }

    /**
     * @Given a List of size :arg1 and type String
     */
    public function aListOfSizeAndTypeString($arg1)
    {
        $this->value = $this->buildList($arg1, "GraphAware is Awesome");
    }

    /**
     * @Given a Map of size :arg1 and type Null
     */
    public function aMapOfSizeAndTypeNull($arg1)
    {
        $this->value = $this->buildMap($arg1, null);
    }

    /**
     * @Given a Map of size :arg1 and type Boolean
     */
    public function aMapOfSizeAndTypeBoolean($arg1)
    {
        $this->value = $this->buildMap($arg1, true);
    }

    /**
     * @Given a Map of size :arg1 and type Integer
     */
    public function aMapOfSizeAndTypeInteger($arg1)
    {
        $this->value = $this->buildMap($arg1, 12);
    }

    /**
     * @Given a Map of size :arg1 and type Float
     */
    public function aMapOfSizeAndTypeFloat($arg1)
    {
        $this->value = $this->buildMap($arg1, 1.23);
    }

    /**
     * @Given a Map of size :arg1 and type String
     */
    public function aMapOfSizeAndTypeString($arg1)
    {
        $this->value = $this->buildMap($arg1, "GraphAware Rocks !");
    }

    /**
     * @Given a Node with great amount of properties and labels
     */
    public function aNodeWithGreatAmountOfPropertiesAndLabels()
    {
        $labels = [];
        $identifier = strtoupper('Label' . sha1(microtime(true) .  rand(0,10000)));
        $labels[] = $identifier;
        foreach (range(0, 100) as $i) {
            $labels[] = 'Label' . $i;
        }

        $properties = $this->buildMap(1000, 'http://graphaware.com');
        $this->value = ['labels' => $labels, 'properties' => $properties, 'identifier' => $identifier];
        $session = $this->driver->session();
        $statement = 'CREATE (n:' . implode(':', $labels) . ') SET n += {props}';
        $session->run($statement, ['props' => $properties]);
    }

    /**
     * @When the driver asks the server to echo this node back
     */
    public function theDriverAsksTheServerToEchoThisNodeBack()
    {
        $session = $this->driver->session();
        $this->result = $session->run("MATCH (n:" . $this->value['identifier'] . ") RETURN n LIMIT 1");
    }

    /**
     * @Then the node value given in the result should be the same as what was sent
     */
    public function theNodeValueGivenInTheResultShouldBeTheSameAsWhatWasSent()
    {
        $node = $this->result->getRecord()->value('n');
        Assert::assertCount(count($this->value['labels']), $node->labels());
        Assert::assertEquals($this->value['properties'], $node->values());
    }

    /**
     * @Given a path P of size :arg1
     */
    public function aPathPOfSize($arg1)
    {
        $startIdentifier = 'start ' . sha1(microtime(true) . rand(0, 10000));
        $endIdentifier = 'end' . sha1(microtime(true) . rand(0, 10000));
        $session = $this->driver->session();
        $session->run("CREATE INDEX ON :Node(i)");
        $session->run("MATCH (n) DETACH DELETE n");
        $session->run("
        UNWIND range(0, 1001) as i
CREATE (z:Node) SET z.i = i
WITH z, i
MATCH (n:Node) WHERE n.i = i-1
MERGE (n)-[:REL]->(z)");
        $session->run("MATCH (n:Node {i:1001}), (z:Node {id:1002}) MERGE (n)-[:REL]->(z)");
    }

    /**
     * @When the driver asks the server to echo this path back
     */
    public function theDriverAsksTheServerToEchoThisPathBack()
    {
        $session = $this->driver->session();
        $this->result = $session->run("MATCH (n:Node {i:0}), (z:Node {i: 1001})
        MATCH p=(n)-[*]->(z) RETURN p");
    }

    /**
     * @Then the path value given in the result should be the same as what was sent
     */
    public function thePathValueGivenInTheResultShouldBeTheSameAsWhatWasSent()
    {
        Assert::assertEquals(1001, $this->result->getRecord()->value('p')->length());
    }

    private function buildList($size, $value)
    {
        $list = [];
        foreach (range(0, $size) as $x) {
            $list[] = $value;
        }

        return $list;
    }

    private function buildMap($size, $value)
    {
        $map = [];
        foreach (range(0, $size) as $x) {
            $map['key' . $x] = $x;
        }

        return $map;
    }
}
