<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) GraphAware Ltd <christophe@graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Protocol;

use GraphAware\Bolt\Protocol\Message\PullAllMessage;
use GraphAware\Bolt\Protocol\Message\RunMessage;
use GraphAware\Bolt\Protocol\V1\Session;
use GraphAware\Common\Result\ResultCollection;

class Pipeline
{
    /**
     * @var \GraphAware\Bolt\Protocol\V1\Session
     */
    protected $session;

    /**
     * @var \GraphAware\Bolt\Protocol\Message\AbstractMessage[]
     */
    protected $messages = [];

    public function __construct(Session $session)
    {
        $this->session = $session;
    }

    /**
     * @param string $query
     * @param array $parameters
     */
    public function push($query, array $parameters = array(), $tag = null)
    {
        $this->messages[] = new RunMessage($query, $parameters, $tag);
    }

    /**
     * @return \GraphAware\Bolt\Protocol\Message\AbstractMessage[]
     */
    public function getMessages()
    {
        return $this->messages;
    }

    /**
     * @return bool
     */
    public function isEmpty()
    {
        return empty($this->messages);
    }

    /**
     * @return \GraphAware\Common\Result\ResultCollection
     *
     * @throws \Exception
     */
    public function run()
    {
        $pullAllMessage = new PullAllMessage();
        $batch = [];
        $resultCollection = new ResultCollection();
        foreach ($this->messages as $message) {
            $batch[] = $message;
            $batch[] = $pullAllMessage;
        }
        $this->session->sendMessages($batch);
        foreach ($this->messages as $message) {
            $resultCollection->add($this->session->recv($message->getStatement(), $message->getParams(), $message->getTag()), $message->getTag());
        }

        return $resultCollection;
    }
}