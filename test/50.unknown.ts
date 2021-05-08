#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as IconvCP932 from "../";

const TITLE = __filename.split("/").pop();
const toArray = (array: Uint8Array) => [].slice.call(array);

// TS2540: Cannot assign to 'UNKNOWN' because it is a read-only property.
const U = IconvCP932 as { UNKNOWN: string };

describe(TITLE, () => {
    let UNKNOWN: string;

    before(() => {
        UNKNOWN = U.UNKNOWN;
    });

    // single byte character x 1
    it(JSON.stringify("?"), () => {
        U.UNKNOWN = IconvCP932.encodeURIComponent("?");
        assert.deepEqual(toArray(IconvCP932.encode("\uFEFF")), [0x3F]);
        assert.equal(IconvCP932.decode(new Uint8Array([0xFE, 0xFF])), "?");
        assert.equal(IconvCP932.encodeURIComponent("\uFEFF"), "%3F");
        assert.equal(IconvCP932.decodeURIComponent("%FE%FF"), "?");
    });

    // single byte character x 2
    it(JSON.stringify("??"), () => {
        U.UNKNOWN = IconvCP932.encodeURIComponent("??");
        assert.deepEqual(toArray(IconvCP932.encode("\uFEFF")), [0x3F, 0x3F]);
        assert.equal(IconvCP932.decode(new Uint8Array([0xFE, 0xFF])), "??");
        assert.equal(IconvCP932.encodeURIComponent("\uFEFF"), "%3F%3F");
        assert.equal(IconvCP932.decodeURIComponent("%FE%FF"), "??");
    });

    // multi byte character x 1
    it(JSON.stringify("？"), () => {
        U.UNKNOWN = IconvCP932.encodeURIComponent("？");
        assert.deepEqual(toArray(IconvCP932.encode("\uFEFF")), [0x81, 0x48]);
        assert.equal(IconvCP932.decode(new Uint8Array([0xFE, 0xFF])), "？");
        assert.equal(IconvCP932.encodeURIComponent("\uFEFF"), "%81%48");
        assert.equal(IconvCP932.decodeURIComponent("%FE%FF"), "？");
    });

    // multi byte character x 2
    it(JSON.stringify("？？"), () => {
        U.UNKNOWN = IconvCP932.encodeURIComponent("？？");
        assert.deepEqual(toArray(IconvCP932.encode("\uFEFF")), [0x81, 0x48, 0x81, 0x48]);
        assert.equal(IconvCP932.decode(new Uint8Array([0xFE, 0xFF])), "？？");
        assert.equal(IconvCP932.encodeURIComponent("\uFEFF"), "%81%48%81%48");
        assert.equal(IconvCP932.decodeURIComponent("%FE%FF"), "？？");
    });

    // empty
    it(JSON.stringify(""), () => {
        U.UNKNOWN = IconvCP932.encodeURIComponent("");
        assert.deepEqual(toArray(IconvCP932.encode("[\uFEFF]")), [0x5B, 0x5D]);
        assert.equal(IconvCP932.decode(new Uint8Array([0x5B, 0xFE, 0xFF, 0x5D])), "[]");
        assert.equal(IconvCP932.encodeURIComponent("[\uFEFF]"), "%5B%5D");
        assert.equal(IconvCP932.decodeURIComponent("[%FE%FF]"), "[]");
    });

    // default Geta
    it(JSON.stringify("〓"), () => {
        U.UNKNOWN = IconvCP932.encodeURIComponent("〓");
        assert.deepEqual(toArray(IconvCP932.encode("\uFEFF")), [0x81, 0xAC]);
        assert.equal(IconvCP932.decode(new Uint8Array([0xFE, 0xFF])), "〓");
        assert.equal(IconvCP932.encodeURIComponent("\uFEFF"), "%81%AC");
        assert.equal(IconvCP932.decodeURIComponent("%FE%FF"), "〓");
    });

    after(() => {
        U.UNKNOWN = UNKNOWN; // restore
    });
});
