/**
 * iconv-cp932
 *
 * @see https://www.npmjs.com/package/iconv-cp932
 */

import {encode} from "./component";

type Table = { [c: string]: string };
type Mapping = { [hex: string]: string };

const mapping: Mapping = require("../mappings/cp932.json");
let encodeTable: Table;
let decodeTable: Table;
let decodeBinTable: string[];

/**
 * GETA MARK "〓"
 */

export const UNKNOWN = "%81%AC";

/**
 * @param str {string} UTF-8 string e.g. "美"
 * @return {string} CP932 URI encoded string e.g. "%94%FC"
 */

export function encodeURIComponent(str: string): string {
    if (!encodeTable) encodeTable = getEncodeTable();

    return str.split("").map(c => encodeTable[c] || UNKNOWN).join("");
}

/**
 * @param str {string} CP932 URI encoded string e.g. "%94%FC"
 * @return {string} UTF-8 string e.g. "美"
 */

export function decodeURIComponent(str: string): string {
    if (!decodeTable) decodeTable = getDecodeTable();
    let unknown: string;

    return unescape(str).replace(/[\x80-\x9F\xE0-\xFF]?[\x00-\xFF]/g, s => {
        return decodeTable[s] || unknown || (unknown = decodeTable[unescape(UNKNOWN)]);
    });
}

/**
 * @param buffer {Uint8Array} CP932 Binary e.g. [0x94, 0xFC]
 * @return {string} UTF-8 string e.g. "美"
 */

export function decode(input: Uint8Array): string {
    let i = 0;
    let {length} = input;
    let unknown: string;

    if (!decodeBinTable) {
        decodeBinTable = new Array(65536);
        parseMapping((jcode, ustr) => decodeBinTable[jcode] = ustr);
    }

    let str = "";
    while (i < length) {
        let c = input[i++];
        if ((0x80 <= c && c <= 0x9F) || (0xE0 <= c && c <= 0xFF)) {
            const low = input[i++];
            c = (c << 8) | low;
        }
        str += decodeBinTable[c] || unknown || (unknown = decodeURIComponent(UNKNOWN));
    }

    return str;
}

/**
 * @private
 */

function getEncodeTable(): Table {
    const table: Table = {};
    const encodeURIComponent = encode;

    parseMapping((jcode, ustr) => {
        let jstr: string;
        if (jcode > 255) {
            jstr = "%" + hex(jcode >> 8) + "%" + hex(jcode & 255);
        } else if (ustr === encodeURIComponent(ustr)) {
            jstr = ustr;
        } else {
            jstr = "%" + hex(jcode);
        }
        table[ustr] = jstr;
    });

    return table;
}

function hex(code: number): string {
    const c = (code).toString(16).toUpperCase();
    return (code < 16 ? ("0" + c) : c);
}

function getDecodeTable(): Table {
    const table: Table = {};

    parseMapping((jcode, ustr) => {
        let jstr = String.fromCharCode(jcode & 255);
        if (jcode > 255) {
            jstr = String.fromCharCode(jcode >> 8) + jstr;
        }
        table[jstr] = ustr;
    });

    return table;
}

function parseMapping(fn: (jcode: number, ustr: string) => void) {
    Object.keys(mapping).forEach(start => {
        let jcode = parseInt(start, 16);
        mapping[start].split("").forEach(ustr => fn(jcode++, ustr));
    });
}