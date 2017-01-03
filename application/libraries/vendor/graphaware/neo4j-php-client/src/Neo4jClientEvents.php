<?php

/**
 * This file is part of the GraphAware Neo4j Client package.
 *
 * (c) GraphAware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Neo4j\Client;

final class Neo4jClientEvents
{
    /**
     * This event is dispatched before a query or a stack is run.
     * An object of type PreRunEvent is given.
     */
    const NEO4J_PRE_RUN = 'neo4j.pre_run';

    /**
     * This event is dispatched after a query or stack is run.
     * An object of type PostRunEvent is given.
     */
    const NEO4J_POST_RUN = 'neo4j.post_run';

    /**
     * This event is dispatched in case of failure during the run.
     * An event of type FailureEvent is given.
     */
    const NEO4J_ON_FAILURE = 'neo4j.on_failure';
}