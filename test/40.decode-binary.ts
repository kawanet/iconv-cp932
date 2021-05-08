#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as IconvCP932 from "../";

const TITLE = __filename.split("/").pop();

type Tests = { [str: string]: string };
const tests: Tests = {
    // japanese
    "美しい日本語": "94FC82B582A293FA967B8CEA",
    // katakana
    "ｶﾀｶﾅ": "B6C0B6C5",
    // latin-1
    "±×÷": "817D817E8180",
    // invalid
    "[〓〓]": "5BFFFEFFFF5D",
    // ascii
    "AB=01&yz=[]": "41423D303126797A3D5B5D",
    // control
    "\x00\x09\x0A\x0D\x7F": "00090A0D7F"
};

describe(TITLE, function () {

    Object.keys(tests).forEach(str => {
        it(JSON.stringify(tests[str]), () => {
            const decoded = IconvCP932.decode(parseHex(tests[str]));
            assert.equal(decoded, str);
        });
    });
});

function parseHex(hex: string): Uint8Array {
    const length = hex.length / 2;
    const buf = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        buf[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return buf;
}