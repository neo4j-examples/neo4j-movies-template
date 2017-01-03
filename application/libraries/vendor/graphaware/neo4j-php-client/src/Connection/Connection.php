<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\Connection;

use GraphAware\Bolt\Configuration;
use GraphAware\Bolt\GraphDatabase as BoltGraphDB;
use GraphAware\Common\Cypher\Statement;
use GraphAware\Neo4j\Client\Exception\Neo4jException;
use GraphAware\Bolt\Exception\MessageFailureException;
use GraphAware\Neo4j\Client\HttpDriver\GraphDatabase as HttpGraphDB;
use GraphAware\Neo4j\Client\Stack;
use GraphAware\Neo4j\Client\HttpDriver\Configuration as HttpConfig;

class Connection
{
    /**
     * @var string The Connection Alias
     */
    private $alias;

    /**
     * @var string
     */
    private $uri;

    /**
     * @var \GraphAware\Common\Driver\DriverInterface The configured driver
     */
    private $driver;

    /**
     * @var \GraphAware\Common\Driver\SessionInterface
     */
    private $session;

    /**
     * @var int
     */
    private $timeout;

    /**
     * Connection constructor.
     *
     * @param string $alias
     * @param string $uri
     */
    public function __construct($alias, $uri, $config = null, $timeout)
    {
        $this->alias = (string) $alias;
        $this->uri = (string) $uri;
        $this->timeout = $timeout;
        $this->buildDriver();
    }

    /**
     * @return string
     */
    public function getAlias()
    {
        return $this->alias;
    }

    private function buildDriver()
    {
        $params = parse_url($this->uri);
        if (preg_match('/bolt/', $this->uri)) {
            $port = isset($params['port']) ? (int) $params['port'] : 7687;
            $uri  = sprintf('%s://%s:%d', $params['scheme'], $params['host'], $port);
            $config = null;
            if (isset($params['user']) && isset($params['pass'])) {
                $config = Configuration::withCredentials($params['user'], $params['pass']);
            }
            $this->driver = BoltGraphDB::driver($uri, $config);
        } elseif (preg_match('/http/', $this->uri)) {
            $uri = $this->uri;
            $this->driver = HttpGraphDB::driver($uri, HttpConfig::withTimeout($this->timeout));
        } else {
            throw new \RuntimeException(sprintf('Unable to build a driver from uri "%s"', $this->uri));
        }
    }

    /**
     * @return \GraphAware\Common\Driver\DriverInterface
     */
    public function getDriver()
    {
        return $this->driver;
    }

    /**
     * @param null $query
     * @param array $parameters
     * @param null $tag
     * @return \GraphAware\Bolt\Protocol\Pipeline|\GraphAware\Neo4j\Client\HttpDriver\Pipeline
     */
    public function createPipeline($query = null, $parameters = array(), $tag = null)
    {
        $this->checkSession();
        $parameters = is_array($parameters) ? $parameters : array();

        return $this->session->createPipeline($query, $parameters, $tag);
    }

    public function run($statement, $parameters, $tag)
    {
        $this->checkSession();
        $parameters = is_array($parameters) ? $parameters : array();
        try {
            $results = $this->session->run($statement, $parameters, $tag);

            return $results;
        } catch (MessageFailureException $e) {
            $exception = new Neo4jException($e->getMessage());
            $exception->setNeo4jStatusCode($e->getStatusCode());

            throw $exception;
        }
    }

    public function runMixed(array $queue)
    {
        $this->checkSession();
        $pipeline = $this->createPipeline();
        foreach ($queue as $element) {
            if ($element instanceof Stack) {
                foreach ($element->statements() as $statement) {
                    $pipeline->push($statement->text(), $statement->parameters(), $statement->getTag());
                }
            } elseif ($element instanceof Statement) {
                $pipeline->push($element->text(), $element->parameters(), $element->getTag());
            }
        }

        return $pipeline->run();
    }

    public function getTransaction()
    {
        $this->checkSession();
        return $this->session->transaction();
    }

    /**
     * @return \GraphAware\Common\Driver\SessionInterface
     */
    public function getSession()
    {
        $this->checkSession();
        return $this->session;
    }

    private function checkSession()
    {
        if (null === $this->session) {
            $this->session = $this->driver->session();
        }
    }
}
