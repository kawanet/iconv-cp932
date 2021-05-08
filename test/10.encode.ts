#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as IconvCP932 from "../";

const TITLE = __filename.split("/").pop();

type Tests = { [str: string]: string };
const tests: Tests = {
    // japanese
    "美しい日本語": "%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA",
    // katakana
    "ｶﾀｶﾅ": "%B6%C0%B6%C5",
    // latin-1
    "±×÷": "%81%7D%81%7E%81%80",
    // invalid
    "[€£]": "%5B%81%AC%81%AC%5D",
    // ascii
    "AB=01&yz=[]": "AB%3D01%26yz%3D%5B%5D",
    // html
    '"&<>?': "%22%26%3C%3E%3F",
    // control
    "\x00\x09\x0A\x0D\x7F": "%00%09%0A%0D%7F"
};

describe(TITLE, function () {

    Object.keys(tests).forEach(str => {
        it(JSON.stringify(str), () => {
            const encoded = IconvCP932.encodeURIComponent(str);
            assert.equal(encoded, tests[str]);
        });
    });
});
