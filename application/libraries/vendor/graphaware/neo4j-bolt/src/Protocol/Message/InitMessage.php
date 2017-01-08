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

class InitMessage extends AbstractMessage
{
    const MESSAGE_TYPE = 'INIT';

    public function __construct($userAgent, array $credentials)
    {
        $authToken = array();
        if (isset($credentials[1]) && null !== $credentials[1]) {
            $authToken = [
                'scheme' => 'basic',
                'principal' => $credentials[0],
                'credentials' => $credentials[1]
            ];
        }
        parent::__construct(Constants::SIGNATURE_INIT, array($userAgent, $authToken));
    }

    public function getMessageType()
    {
        return self::MESSAGE_TYPE;
    }
}