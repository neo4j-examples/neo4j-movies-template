<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Protocol\Message;

use GraphAware\Bolt\Protocol\Constants;

abstract class AbstractMessage implements MessageInterface
{
    protected $signature;

    protected $fields = [];

    protected $isSerialized = false;

    protected $serialization = null;

    public function __construct($signature, array $fields = array())
    {
        $this->signature = $signature;
        $this->fields = $fields;
    }

    public function getSignature()
    {
        return $this->signature;
    }

    public function getFields()
    {
        return $this->fields;
    }

    public function getFieldsLength()
    {
        return count($this->fields);
    }

    public function setSerialization($stream)
    {
        $this->serialization = $stream;
        $this->isSerialized = true;
    }

    public function getSerialization()
    {
        return $this->serialization;
    }

    public function isSuccess()
    {
        return $this->getMessageType() === 'SUCCESS';
    }

    public function isFailure()
    {
        return $this->getMessageType() === 'FAILURE';
    }

    public function isRecord()
    {
        return $this->getMessageType() === 'RECORD';
    }

    public function hasFields()
    {
        return !empty($this->fields);
    }
}