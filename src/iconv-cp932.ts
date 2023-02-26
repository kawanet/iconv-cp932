/**
 * iconv-cp932
 *
 * @see https://www.npmjs.com/package/iconv-cp932
 */

type Mapping = { [hex: string]: string };

const CP932: Mapping = require("../mappings/cp932.json");
const IBM: Mapping = require("../mappings/ibm.json");

/**
 * GETA MARK "〓"
 */

export let UNKNOWN = "%81%AC";
let unknownSize = 2;

/**
 * lazy build
 */
const lazy = <T>(fn: () => T): (() => T) => {
    let v: T;
    return () => (v || (v = fn()));
};

const cached = <U, T>(fn: (c: U) => T): ((c: U) => T) => {
    const cache: { [c: string]: T } = {};
    return ns => (cache[ns as string] || (cache[ns as string] = fn(ns)));
};

/**
 * @param str {string} UTF-8 string e.g. "美"
 * @return {string} CP932 URI encoded string e.g. "%94%FC"
 */

function _encodeURIComponent(str: string): string {
    const encodeTable = getEncodeTable();

    return str.replace(/./sg, c => encodeTable[c] || UNKNOWN);
}

export {_encodeURIComponent as encodeURIComponent};

/**
 * @param str {string} CP932 URI encoded string e.g. "%94%FC"
 * @return {string} UTF-8 string e.g. "美"
 */

export function decodeURIComponent(str: string): string {
    const decodeTable = getDecodeTable();

    return unescape(str).replace(/[\x80-\x9F\xE0-\xFF][\x00-\xFF]|[\xA0-\xDF]/g, s => {
        return decodeTable[s] || cachedDecode(UNKNOWN);
    });
}

/**
 * @param str {string} UTF-8 string e.g. "美"
 * @return {Uint8Array} CP932 Binary e.g. [0x94, 0xFC]
 */

export function encode(str: string): Uint8Array {
    const encodeBinTable = getEncodeBinTable();

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
                unknown = cachedEncode(UNKNOWN);
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
 * @param buffer {Uint8Array} CP932 Binary e.g. [0x94, 0xFC]
 * @return {string} UTF-8 string e.g. "美"
 */

export function decode(buffer: Uint8Array): string {
    let i = 0;
    let {length} = buffer;

    const decodeBinTable = getDecodeBinTable();

    let str = "";
    while (i < length) {
        let c = buffer[i++];
        if ((0x80 <= c && c <= 0x9F) || (0xE0 <= c && c <= 0xFF)) {
            const low = buffer[i++];
            c = (c << 8) | low;
        }
        str += decodeBinTable[c] || cachedDecode(UNKNOWN);
    }

    return str;
}

/**
 * @private
 */

const cachedEncode = cached((c: string) => {
    return encode(decodeURIComponent(c));
});

const cachedDecode = cached(decodeURIComponent);

const getEncodeTable = lazy(() => {
    const table: { [c: string]: string } = {};

    encoderMapping((jcode, ustr) => {
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
});

const hex = (code: number): string => {
    const c = (code).toString(16).toUpperCase();
    return (code < 16 ? ("0" + c) : c);
};

const getDecodeTable = lazy(() => {
    const table: { [c: string]: string } = {};

    decoderMapping((jcode, ustr) => {
        let jstr = String.fromCharCode(jcode & 255);
        if (jcode > 255) {
            jstr = String.fromCharCode(jcode >> 8) + jstr;
        }
        table[jstr] = ustr;
    });

    return table;
});

const getDecodeBinTable = lazy(() => {
    const table: string[] = new Array(65536);
    decoderMapping((jcode, ustr) => table[jcode] = ustr);
    return table;
});

const decoderMapping = (fn: (jcode: number, ustr: string) => void) => {
    applyMapping(CP932, fn);
    applyMapping(IBM, fn);
};

const getEncodeBinTable = lazy(() => {
    const table: { [c: string]: number } = {};
    encoderMapping((jcode, ustr) => table[ustr] = jcode);
    return table;
});

const encoderMapping = (fn: (jcode: number, ustr: string) => void) => {
    applyMapping(CP932, fn);
};

const applyMapping = (mapping: Mapping, fn: (jcode: number, ustr: string) => void) => {
    Object.keys(mapping).forEach(start => {
        let jcode = parseInt(start, 16);
        mapping[start].split("").forEach(ustr => fn(jcode++, ustr));
    });
};
