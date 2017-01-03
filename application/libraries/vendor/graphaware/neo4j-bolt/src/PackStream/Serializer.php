<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\PackStream;

use GraphAware\Bolt\PackStream\Structure\MessageStructure;
use GraphAware\Bolt\Protocol\Message\AbstractMessage;
use GraphAware\Bolt\Protocol\Message\FailureMessage;
use GraphAware\Bolt\Protocol\Message\RawMessage;
use GraphAware\Bolt\Protocol\Message\RecordMessage;
use GraphAware\Bolt\Protocol\Message\SuccessMessage;
use GraphAware\Bolt\PackStream\Packer;

class Serializer
{
    /**
     * @var \GraphAware\Bolt\PackStream\Packer
     */
    protected $packer;

    /**
     * @var \GraphAware\Bolt\PackStream\Unpacker
     */
    protected $unpacker;

    public function __construct(Packer $packer, Unpacker $unpacker)
    {
        $this->packer = $packer;
        $this->unpacker = $unpacker;
    }

    public function serialize(AbstractMessage $message)
    {
        $buffer = '';
        $buffer .= $this->packer->packStructureHeader($message->getFieldsLength(), $message->getSignature());
        foreach ($message->getFields() as $field) {
            $buffer .= $this->packer->pack($field);
        }

        $message->setSerialization($buffer);
    }


    public function deserialize(RawMessage $message)
    {
        $structure = $this->unpacker->unpackRaw($message);

        //print_r($structure);

        return $structure;
    }

    public function convertStructureToSuccessMessage(MessageStructure $structure, RawMessage $rawMessage)
    {
        $message = new SuccessMessage($structure->getElements()[0]);
        $message->setSerialization($rawMessage->getBytes());

        return $message;
    }

    public function convertStructureToRecordMessage(MessageStructure $structure, RawMessage $rawMessage)
    {
        //print_r($structure);
        $message = new RecordMessage($structure->getElements()[0]);
        $message->setSerialization($rawMessage->getBytes());

        return $message;
    }

    public function convertStructureToFailureMessage(MessageStructure $structure, RawMessage $rawMessage)
    {
        $message = new FailureMessage($structure->getElements()[0]);
        $message->setSerialization($rawMessage->getBytes());

        return $message;
    }
}