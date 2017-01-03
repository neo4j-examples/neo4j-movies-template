<?php

/**
 * This file is part of the GraphAware Neo4j Common package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace GraphAware\Common\Cypher;

use MyCLabs\Enum\Enum;

final class StatementType extends Enum
{
    const READ_ONLY = 'STATEMENT_READ_ONLY';

    const READ_WRITE = 'STATEMENT_READ_WRITE';

    const WRITE_ONLY = 'STATEMENT_WRITE_ONLY';

    const SCHEMA_WRITE = 'STATEMENT_SCHEMA_WRITE';
}
