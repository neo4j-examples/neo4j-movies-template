<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client\Exception;

interface Neo4jExceptionInterface extends NeoClientExceptionInterface
{
    const EFFECT_NONE = 'NONE';

    const EFFECT_ROLLBACK = 'ROLLBACK';

    public function effect();
}