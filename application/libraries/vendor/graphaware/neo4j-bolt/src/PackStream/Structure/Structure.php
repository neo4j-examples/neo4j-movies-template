<?php

namespace GraphAware\Bolt\PackStream\Structure;

class Structure
{
    private $signature;

    private $elements = [];

    private $size = 0;

    public function __construct($signature, $size)
    {
        $this->signature = $signature;
        $this->size = (int) $size;
    }

    public function addElement($elt)
    {
        $this->elements[] = $elt;
    }

    public function setElements($elts)
    {
        $this->elements = $elts;
    }

    /**
     * @return mixed
     */
    public function getSignature()
    {
        return $this->signature;
    }

    /**
     * @return array
     */
    public function getElements()
    {
        if (in_array($this->signature, $this->types())) {
            return $this->elements;
        }

        return $this->elements[0];
    }

    /**
     * @return int
     */
    public function getSize()
    {
        return $this->size;
    }


    public function getValue()
    {
        return $this->elements;
    }

    public function isSuccess()
    {
        return "SUCCESS" === $this->signature;
    }

    public function isRecord()
    {
        return "RECORD" === $this->signature;
    }

    public function isFailure()
    {
        return "FAILURE" === $this->signature;
    }

    public function hasFields()
    {
        $elts = $this->getElements();

        return array_key_exists('fields', $elts);
    }

    public function getFields()
    {
        return $this->getElements()['fields'];
    }

    public function hasStatistics()
    {
        $elts = $this->getElements();

        return array_key_exists('stats', $elts);
    }

    public function getStatistics()
    {
        $elts = $this->getElements();

        return array_key_exists('stats', $elts) ? $elts['stats'] : [];
    }

    public function hasType()
    {
        $elts = $this->getElements();

        return array_key_exists('type', $elts);
    }

    public function getType()
    {
        $elts = $this->getElements();

        return $elts['type'];
    }

    private function types()
    {
        return ['NODE', 'RELATIONSHIP', 'PATH', 'UNBOUND_RELATIONSHIP'];
    }
}