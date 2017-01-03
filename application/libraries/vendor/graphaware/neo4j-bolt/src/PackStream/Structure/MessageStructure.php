<?php

/*
 * This file is part of the GraphAware Bolt package.
 *
 * (c) Graph Aware Limited <http://graphaware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace GraphAware\Bolt\PackStream\Structure;

use Doctrine\Common\Collections\ArrayCollection;
use GraphAware\Bolt\PackStream\Structure\AbstractElement;

class MessageStructure
{
    protected $signature;

    protected $size;

    /**
     * @var array
     */
    protected $elements;

    public function __construct($signature, $size)
    {
        $this->signature = $signature;
        $this->size = $size;
    }

    public function addElement($element)
    {
        $this->elements[] = $element;
    }

    public function getElements()
    {
        return $this->elements[0];
    }

    public function isSuccess()
    {
        return 'SUCCESS' === $this->signature;
    }

    public function isFailure()
    {
        return 'FAILURE' === $this->signature;
    }

    public function isIgnored()
    {
        return 'IGNORED' === $this->signature;
    }

    public function isRecord()
    {
        return 'RECORD' === $this->signature;
    }
}