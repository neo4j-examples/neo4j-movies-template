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

class PullAllMessage extends AbstractMessage
{
    const MESSAGE_TYPE = 'PULL_ALL';

    public function __construct()
    {
        parent::__construct(Constants::SIGNATURE_PULL_ALL);
    }

    public function getMessageType()
    {
        return self::MESSAGE_TYPE;
    }
}