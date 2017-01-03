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

use GraphAware\Bolt\PackStream\Structure\Map;
use GraphAware\Bolt\Protocol\Constants;

class SuccessMessage extends AbstractMessage
{
    const MESSAGE_TYPE = 'SUCCESS';

    protected $map;

    public function __construct($map)
    {
        parent::__construct(Constants::SIGNATURE_SUCCESS);
        $this->map = $map;
    }

    public function getMessageType()
    {
        return self::MESSAGE_TYPE;
    }

    public function getFields()
    {
        return $this->map['fields'];
    }

    public function hasFields()
    {
        return array_key_exists('fields', $this->map);
    }

    public function hasStatistics()
    {
        return array_key_exists('stats', $this->map);
    }

    public function getStatistics()
    {
        return $this->map['stats'];
    }

    public function hasType()
    {
        return array_key_exists('type', $this->map);
    }
    public function getType()
    {
        return $this->map['type'];
    }
}