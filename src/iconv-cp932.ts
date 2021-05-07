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

/**
 * GETA MARK
 */

export const UNKNOWN = "%81%AC";

/**
 * @param str {string}
 * @return {string}
 */

export function encodeURIComponent(str: string): string {
    if (!encodeTable) encodeTable = getEncodeTable();

    return str.split("").map(c => encodeTable[c] || UNKNOWN).join("");
}

/**
 * @param str {string}
 * @return {string}
 */

export function decodeURIComponent(str: string): string {
    if (!decodeTable) decodeTable = getDecodeTable();
    let unknown: string;

    return unescape(str).replace(/[\x80-\x9F\xE0-\xFF]?[\x00-\xFF]/g, function (s) {
        return decodeTable[s] || unknown || (unknown = decodeTable[unescape(UNKNOWN)]);
    });
}

/**
 * @private
 */

function getEncodeTable(): Table {
    const table: Table = {};

    Object.keys(mapping).forEach(start => {
        let jcode = parseInt(start, 16);
        mapping[start].split("").forEach(ustr => {
            let jstr: string;
            if (jcode > 255) {
                jstr = "%" + hex(jcode >> 8) + "%" + hex(jcode & 255);
            } else if (ustr === encode(ustr)) {
                jstr = ustr;
            } else {
                jstr = "%" + hex(jcode);
            }
            table[ustr] = jstr;
            jcode++;
        });
    });

    return table;

    function hex(code: number): string {
        const c = (code).toString(16).toUpperCase();
        return (code < 16 ? ("0" + c) : c);
    }
}

function getDecodeTable(): Table {
    const table: Table = {};

    Object.keys(mapping).forEach(start => {
        let jcode = parseInt(start, 16);

        mapping[start].split("").forEach(ustr => {
            let jstr = String.fromCharCode(jcode & 255);
            if (jcode > 255) {
                jstr = String.fromCharCode(jcode >> 8) + jstr;
            }
            table[jstr] = ustr;
            jcode++;
        });
    });

    return table;
}