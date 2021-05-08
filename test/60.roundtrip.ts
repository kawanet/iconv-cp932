#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {decode, decodeURIComponent, encode, encodeURIComponent} from "../";

const TITLE = __filename.split("/").pop();

type Mapping = { [hex: string]: string };
const mapping: Mapping = require("../mappings/cp932.json");

describe(TITLE, () => {
    it("decode(encode(str))", () => {
        Object.keys(mapping).forEach(key => {
            const str = mapping[key];
            assert.equal(decode(encode(str)), str);
        });
    });

    it("decodeURIComponent(encodeURIComponent(str))", () => {
        Object.keys(mapping).forEach(key => {
            const str = mapping[key];
            assert.equal(decodeURIComponent(encodeURIComponent(str)), str);
        });
    });
});
