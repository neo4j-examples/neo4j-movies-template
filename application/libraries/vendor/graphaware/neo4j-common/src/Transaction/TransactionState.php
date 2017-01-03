<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Transaction;

use MyCLabs\Enum\Enum;

final class TransactionState extends Enum
{
    const OPEN = 'TRANSACTION_OPEN';

    const ROLLED_BACK = 'TRANSACTION_ROLLED_BACK';

    const COMMITED = 'TRANSACTION_COMMITED';
}
