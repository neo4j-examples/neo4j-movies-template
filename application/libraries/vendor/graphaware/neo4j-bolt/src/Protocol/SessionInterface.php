<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) GraphAware Ltd <christophe@graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Protocol;

interface SessionInterface
{
    public static function getProtocolVersion();

    /**
     * @param $statement
     * @param array $parameters
     * @return \GraphAware\Bolt\Result\Result
     */
    public function run($statement, array $parameters = array());

    public function runPipeline(Pipeline $pipeline);

    /**
     * @return \GraphAware\Bolt\Protocol\Pipeline
     */
    public function createPipeline();

    public function close();

    /**
     * @return \GraphAware\Bolt\Protocol\V1\Transaction
     */
    public function transaction();
}