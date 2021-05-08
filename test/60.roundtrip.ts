#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {decode, decodeURIComponent, encode, encodeURIComponent} from "../";

const TITLE = __filename.split("/").pop();

type Mapping = { [hex: string]: string };

const CP932: Mapping = require("../mappings/cp932.json");
const IBM: Mapping = require("../mappings/ibm.json");
const toArray = (map: Mapping) => Object.keys(map).map(key => map[key]);
const text = [].concat(toArray(CP932), toArray(IBM));

describe(TITLE, () => {
    it("decode(encode(str))", () => {
        for (const str of text) {
            assert.equal(decode(encode(str)), str);
        }
    });

    it("decodeURIComponent(encodeURIComponent(str))", () => {
        for (const str of text) {
            assert.equal(decodeURIComponent(encodeURIComponent(str)), str);
        }
    });
});
