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
    "[€£]": "5B81AC81AC5D",
    // ascii
    "AB=01&yz=[]": "41423D303126797A3D5B5D",
    // control
    "\x00\x09\x0A\x0D\x7F": "00090A0D7F",
    // NEC extensions
    "NEC-﨑鄧髙": "4E45432DED95EE9DEEE0",
    // IBM extensions not supported for encoding
    // "IBM-﨑鄧髙": "49424D2DFAB1FBB9FBFC",
};

describe(TITLE, function () {

    Object.keys(tests).forEach(str => {
        it(JSON.stringify(str), () => {
            const encoded = IconvCP932.encode(str);
            assert.equal(toHEX(encoded), tests[str]);
        });
    });
});

function toHEX(input: Uint8Array): string {
    let hex = "";
    const {length} = input;
    for (let i = 0; i < length; i++) {
        const c = input[i];
        if (c < 16) hex += "0";
        hex += c.toString(16);
    }
    return hex.toUpperCase();
}
