<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client;

use GraphAware\Neo4j\Client\Connection\ConnectionManager;
use Symfony\Component\EventDispatcher\EventDispatcher;

class ClientBuilder
{
    const PREFLIGHT_ENV_DEFAULT = 'NEO4J_DB_VERSION';

    const DEFAULT_TIMEOUT = 5;

    private static $TIMEOUT_CONFIG_KEY = "timeout";

    /**
     * @var array
     */
    protected $config = [];

    public function __construct()
    {
        $this->config['connection_manager']['preflight_env'] = self::PREFLIGHT_ENV_DEFAULT;
    }

    /**
     * Creates a new Client factory
     *
     * @return ClientBuilder
     */
    public static function create()
    {
        return new self();
    }

    /**
     * Add a connection to the handled connections
     *
     * @param string $alias
     * @param string $uri
     *
     * @return $this
     */
    public function addConnection($alias, $uri)
    {
        $this->config['connections'][$alias]['uri'] = $uri;

        return $this;
    }

    public function preflightEnv($variable)
    {
        $this->config['connection_manager']['preflight_env'] = $variable;
    }

    /**
     * @param string $connectionAlias
     *
     * @return $this
     */
    public function setMaster($connectionAlias)
    {
        if (!isset($this->config['connections']) || !array_key_exists($connectionAlias, $this->config['connections'])) {
            throw new \InvalidArgumentException(sprintf('The connection "%s" is not registered',  (string) $connectionAlias));
        }

        if (isset($this->config['connections'])) {
            foreach ($this->config['connections'] as $k => $conn) {
                $conn['is_master'] = false;
                $this->config['connections'][$k] = $conn;
            }
        }

        $this->config['connections'][$connectionAlias]['is_master'] = true;

        return $this;
    }

    /**
     * @param int $timeout
     *
     * @return $this
     */
    public function setDefaultTimeout($timeout)
    {
        $this->config[self::$TIMEOUT_CONFIG_KEY] = (int) $timeout;

        return $this;
    }

    public function registerEventListener($eventName, $callback)
    {
        $this->config['event_listeners'][$eventName][] = $callback;

        return $this;
    }

    /**
     * Builds a Client based on the connections given
     *
     * @return \GraphAware\Neo4j\Client\Client
     */
    public function build()
    {
        $connectionManager = new ConnectionManager();
        foreach ($this->config['connections'] as $alias => $conn) {
            $connectionManager->registerConnection($alias, $conn['uri'], null, $this->getDefaultTimeout());
            if (isset($conn['is_master']) && $conn['is_master'] === true) {
                $connectionManager->setMaster($alias);
            }
        }
        $ev = null;
        if (isset($this->config['event_listeners'])) {
            $ev = new EventDispatcher();
            foreach ($this->config['event_listeners'] as $k => $callbacks) {
                foreach ($callbacks as $callback) {
                    $ev->addListener($k, $callback);
                }
            }
        }
        return new Client($connectionManager, $ev);
    }

    /**
     * @return int
     */
    private function getDefaultTimeout()
    {
        return array_key_exists(self::$TIMEOUT_CONFIG_KEY, $this->config) ? $this->config[self::$TIMEOUT_CONFIG_KEY] : self::DEFAULT_TIMEOUT;
    }
}
