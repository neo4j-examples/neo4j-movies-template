<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\Misc;

class Helper
{
    public static function prettyHex($raw)
    {
        $split = str_split(bin2hex($raw), 2);

        return implode(':', $split);
    }
}