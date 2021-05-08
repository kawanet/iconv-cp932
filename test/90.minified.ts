#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    const IconvCP932 = require("../public/iconv-cp932.min");

    it("encodeURIComponent()", () => {
        const encoded = IconvCP932.encodeURIComponent("美しい日本語");
        assert.equal(encoded, "%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA");
    });

    it("decodeURIComponent()", () => {
        const decoded = IconvCP932.decodeURIComponent("%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA");
        assert.equal(decoded, "美しい日本語");
    });
});
