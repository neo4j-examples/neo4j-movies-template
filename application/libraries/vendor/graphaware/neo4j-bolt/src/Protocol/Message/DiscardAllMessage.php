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

class DiscardAllMessage extends AbstractMessage
{
    const MESSAGE_TYPE = 'DISCARD_ALL';

    public function __construct()
    {
        parent::__construct(Constants::SIGNATURE_DISCARD_ALL);
    }

    public function getMessageType()
    {
        return self::MESSAGE_TYPE;
    }
}