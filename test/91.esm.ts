#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import type * as IconvCP932JS from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    let IconvCP932: typeof IconvCP932JS;

    before(async () => {
        IconvCP932 = await import("../index.mjs" as string);
    });

    it("encodeURIComponent()", () => {
        const encoded = IconvCP932.encodeURIComponent("美しい日本語");
        assert.equal(encoded, "%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA");
    });

    it("decodeURIComponent()", () => {
        const decoded = IconvCP932.decodeURIComponent("%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA");
        assert.equal(decoded, "美しい日本語");
    });
});
