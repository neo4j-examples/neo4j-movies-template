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

class AckFailureMessage extends AbstractMessage
{
    const MESSAGE_TYPE = 'ACK_FAILURE';

    public function __construct()
    {
        parent::__construct(Constants::SIGNATURE_ACK_FAILURE);
    }

    public function getMessageType()
    {
        return self::MESSAGE_TYPE;
    }
}