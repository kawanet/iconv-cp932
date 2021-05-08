/**
 * iconv-cp932
 *
 * @see https://www.npmjs.com/package/iconv-cp932
 */

type Mapping = { [hex: string]: string };

const mapping: Mapping = require("../mappings/cp932.json");
let encodeTable: { [c: string]: string };
let decodeTable: { [c: string]: string };
let encodeBinTable: { [c: string]: number };
let decodeBinTable: string[];

/**
 * GETA MARK "〓"
 */

export let UNKNOWN = "%81%AC";
let unknownSize = 2;
let unknownCache = {} as { [str: string]: Uint8Array };

/**
 * @param str {string} UTF-8 string e.g. "美"
 * @return {string} CP932 URI encoded string e.g. "%94%FC"
 */

function _encodeURIComponent(str: string): string {
    if (!encodeTable) encodeTable = getEncodeTable();

    return str.replace(/./sg, c => encodeTable[c] || UNKNOWN);
}

export {_encodeURIComponent as encodeURIComponent};

/**
 * @param str {string} CP932 URI encoded string e.g. "%94%FC"
 * @return {string} UTF-8 string e.g. "美"
 */

export function decodeURIComponent(str: string): string {
    if (!decodeTable) decodeTable = getDecodeTable();
    let unknown: string;

    return unescape(str).replace(/[\x80-\x9F\xE0-\xFF][\x00-\xFF]|[\xA0-\xDF]/g, s => {
        return decodeTable[s] || unknown || (unknown = decodeURIComponent(UNKNOWN));
    });
}

/**
 * @param str {string} UTF-8 string e.g. "美"
 * @return {Uint8Array} CP932 Binary e.g. [0x94, 0xFC]
 */

export function encode(str: string): Uint8Array {
    if (!encodeBinTable) {
        encodeBinTable = {};
        parseMapping((jcode, ustr) => encodeBinTable[ustr] = jcode);
    }

    let {length} = str;
    const bufSize = length * Math.max(unknownSize, 2);
    const buffer = new Uint8Array(bufSize);
    let unknown: Uint8Array;
    let i = 0;
    let cur = 0;
    while (i < length) {
        let code = encodeBinTable[str[i++]]; // code 0 is valid
        if (code == null) {
            if (!unknown) {
                unknown = getUnknownBuf();
                const size = unknown.length;
                if (size !== unknownSize) {
                    unknownSize = size;
                    return encode(str); // retry with resized buffer
                }
            }
            for (let j = 0; j < unknownSize; j++) {
                buffer[cur++] = unknown[j];
            }
        } else if (code < 256) {
            buffer[cur++] = code;
        } else {
            buffer[cur++] = code >> 8;
            buffer[cur++] = code & 255;
        }
    }

    if (cur === bufSize) return buffer;
    return buffer.slice(0, cur);
}

/**
 * @param input {Uint8Array} CP932 Binary e.g. [0x94, 0xFC]
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

function getUnknownBuf() {
    const str = UNKNOWN;
    const buf = unknownCache[str];
    if (buf) return buf;
    unknownCache = {}; // reset
    return unknownCache[str] = encode(decodeURIComponent(str));
}

function getEncodeTable() {
    const table = {} as typeof encodeTable;

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

function getDecodeTable() {
    const table = {} as typeof decodeTable;

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