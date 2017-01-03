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

class Constants
{
    // SIGNATURES

    const SIGNATURE_RUN = 0x10;

    const SIGNATURE_PULL_ALL = 0x3f;

    const SIGNATURE_DISCARD_ALL = 0x2f;

    const SIGNATURE_SUCCESS = 0x70;

    const SIGNATURE_INIT = 0x01;

    const SIGNATURE_FAILURE = 0x7f;

    const SIGNATURE_ACK_FAILURE = 0x0f;

    const SIGNATURE_IGNORE = 0x7E;

    const SIGNATURE_RECORD = 0x71;

    const SIGNATURE_NODE = 0x4e;

    const SIGNATURE_RELATIONSHIP = 0x52;

    const SIGNATURE_PATH = 0x50;

    const SIGNATURE_UNBOUND_RELATIONSHIP = 0x72;


    // STRUCTURES

    const STRUCTURE_TINY = 0xb0;

    const STRUCTURE_MEDIUM = 0xdc;

    const STRUCTURE_LARGE = 0xdd;


    // TEXTS

    const TEXT_TINY = 0x80;

    const TEXT_8 = 0xd0;

    const TEXT_16 = 0xd1;

    const TEXT_32 = 0xd2;


    // INTEGERS

    const INT_8 = 0xc8;

    const INT_16 = 0xc9;

    const INT_32 = 0xca;

    const INT_64 = 0xcb;


    // MAPS

    const MAP_TINY = 0xa0;

    const MAP_8 = 0xd8;

    const MAP_16 = 0xd9;

    const MAP_32 = 0xda;


    // LISTS

    const LIST_TINY = 0x90;

    const LIST_8 = 0xd4;

    const LIST_16 = 0xd5;

    const LIST_32 = 0xd6;


    // SIZES

    const SIZE_TINY = 16;

    const SIZE_8 = 256;

    const SIZE_16 = 65536;

    const SIZE_32 = 4294967295;

    const SIZE_MEDIUM = 256;

    const SIZE_LARGE = 65536;

    // FLOAT

    const MARKER_FLOAT = 0xc1;


    // MISC

    const MISC_ZERO = 0x00;


    const MARKER_NULL = 0xc0;

    const MARKER_TRUE = 0xc3;

    const MARKER_FALSE = 0xc2;
}