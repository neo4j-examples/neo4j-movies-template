<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\HttpDriver;

use GraphAware\Common\Cypher\Statement;
use GraphAware\Common\Driver\ConfigInterface;
use GraphAware\Common\Driver\SessionInterface;
use GraphAware\Neo4j\Client\Exception\Neo4jException;
use GraphAware\Neo4j\Client\Formatter\ResponseFormatter;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\Request;

class Session implements SessionInterface
{
    protected $uri;

    protected $httpClient;

    protected $responseFormatter;

    public $transaction;

    protected $config;

    public function __construct($uri, Client $httpClient, ConfigInterface $config)
    {
        $this->uri = $uri;
        $this->httpClient = $httpClient;
        $this->responseFormatter = new ResponseFormatter();
        $this->config = $config;
    }

    public function run($statement, array $parameters = array(), $tag = null)
    {
        $parameters = is_array($parameters) ? $parameters : array();
        $pipeline = $this->createPipeline($statement, $parameters, $tag);
        $response = $pipeline->run();

        return $response->results()[0];
    }

    /**
     * @param string|null $query
     * @param array $parameters
     * @param string|null $tag
     * @return \GraphAware\Neo4j\Client\HttpDriver\Pipeline
     */
    public function createPipeline($query = null, array $parameters = array(), $tag = null)
    {
        $pipeline = new Pipeline($this);
        if (null !== $query) {
            $pipeline->push($query, $parameters, $tag);
        }

        return $pipeline;
    }

    /**
     * @param \GraphAware\Neo4j\Client\HttpDriver\Pipeline $pipeline
     * @return \GraphAware\Common\Result\ResultCollection
     *
     * @throws \GraphAware\Neo4j\Client\Exception\Neo4jException
     */
    public function flush(Pipeline $pipeline)
    {
        $request = $this->prepareRequest($pipeline);
        try {
            $response = $this->httpClient->send($request);
            $results = $this->responseFormatter->format(json_decode($response->getBody(), true), $pipeline->statements());

            return $results;
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $body = json_decode($e->getResponse()->getBody(), true);
                if (!isset($body['code'])) {
                    throw $e;
                }
                $msg = sprintf('Neo4j Exception with code "%s" and message "%s"', $body['errors'][0]['code'], $body['errors'][0]['message']);
                $exception = new Neo4jException($msg);
                $exception->setNeo4jStatusCode($body['errors'][0]['code']);

                throw $exception;
            }

            throw $e;
        }
    }

    public function close()
    {
        //
    }

    public function prepareRequest(Pipeline $pipeline)
    {
        $statements = [];
        foreach ($pipeline->statements() as $statement) {
            $st = [
                'statement' => $statement->text(),
                'resultDataContents' => ["REST", "GRAPH"],
                'includeStats' => true
            ];
            if (!empty($statement->parameters())) {
                $st['parameters'] = $statement->parameters();
            }
            $statements[] = $st;
        }

        $body = json_encode([
            'statements' => $statements
        ]);
        $headers = [
            [
                'X-Stream' => true,
                'Content-Type' => 'application/json'
            ]
        ];

        $request = new Request("POST", sprintf('%s/db/data/transaction/commit', $this->uri), $headers, $body);

        return $request;
    }

    public function transaction()
    {
        if ($this->transaction instanceof Transaction) {
            throw new \RuntimeException('A transaction is already bound to this session');
        }

        return new Transaction($this);
    }

    /**
     * @return mixed|\Psr\Http\Message\ResponseInterface
     * @throws \GraphAware\Neo4j\Client\Exception\Neo4jException
     */
    public function begin()
    {
        $request = new Request("POST", sprintf('%s/db/data/transaction', $this->uri));
        try {
            $response = $this->httpClient->send($request);

            return $response;
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $body = json_decode($e->getResponse()->getBody(), true);
                if (!isset($body['code'])) {
                    throw $e;
                }
                $msg = sprintf('Neo4j Exception with code "%s" and message "%s"', $body['errors'][0]['code'], $body['errors'][0]['message']);
                $exception = new Neo4jException($msg);
                $exception->setNeo4jStatusCode($body['errors'][0]['code']);

                throw $exception;
            }

            throw $e;
        }
    }

    public function pushToTransaction($transactionId, array $statementsStack)
    {
        $statements = [];
        foreach ($statementsStack as $statement) {
            $st = [
                'statement' => $statement->text(),
                'resultDataContents' => ["REST", "GRAPH"],
                'includeStats' => true
            ];
            if (!empty($statement->parameters())) {
                $st['parameters'] = $statement->parameters();
            }
            $statements[] = $st;
        }

        $headers = [
            [
                'X-Stream' => true,
                'Content-Type' => 'application/json'
            ]
        ];

        $body = json_encode([
            'statements' => $statements
        ]);
        $request = new Request("POST", sprintf('%s/db/data/transaction/%d', $this->uri, $transactionId), $headers, $body);
        try {
            $response = $this->httpClient->send($request);
            $results = $this->responseFormatter->format(json_decode($response->getBody(), true), $statementsStack);

            return $results;
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $body = json_decode($e->getResponse()->getBody(), true);
                if (!isset($body['code'])) {
                    throw $e;
                }
                $msg = sprintf('Neo4j Exception with code "%s" and message "%s"', $body['errors'][0]['code'], $body['errors'][0]['message']);
                $exception = new Neo4jException($msg);
                $exception->setNeo4jStatusCode($body['errors'][0]['code']);

                throw $exception;
            }

            throw $e;
        }
    }

    public function commitTransaction($transactionId)
    {
        $request = new Request("POST", sprintf('%s/db/data/transaction/%d/commit', $this->uri, $transactionId));
        try {
            $this->httpClient->send($request);
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $body = json_decode($e->getResponse()->getBody(), true);
                if (!isset($body['code'])) {
                    throw $e;
                }
                $msg = sprintf('Neo4j Exception with code "%s" and message "%s"', $body['errors'][0]['code'], $body['errors'][0]['message']);
                $exception = new Neo4jException($msg);
                $exception->setNeo4jStatusCode($body['errors'][0]['code']);

                throw $exception;
            }

            throw $e;
        }
    }

    public function rollbackTransaction($transactionId)
    {
        $request = new Request("DELETE", sprintf('%s/db/data/transaction/%d', $this->uri, $transactionId));
        try {
            $this->httpClient->send($request);
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $body = json_decode($e->getResponse()->getBody(), true);
                if (!isset($body['code'])) {
                    throw $e;
                }
                $msg = sprintf('Neo4j Exception with code "%s" and message "%s"', $body['errors'][0]['code'], $body['errors'][0]['message']);
                $exception = new Neo4jException($msg);
                $exception->setNeo4jStatusCode($body['errors'][0]['code']);

                throw $exception;
            }

            throw $e;
        }
    }
}