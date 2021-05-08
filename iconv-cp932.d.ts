/**
 * iconv-cp932
 *
 * @see https://www.npmjs.com/package/iconv-cp932
 */

export let UNKNOWN: string;

/**
 * @param str {string} UTF-8 string e.g. "美"
 * @return {Uint8Array} CP932 Binary e.g. [0x94, 0xFC]
 */
export function encode(str: string): Uint8Array;

/**
 * @param str {string} UTF-8 string e.g. "美"
 * @return {string} CP932 URI encoded string e.g. "%94%FC"
 */
export function encodeURIComponent(str: string): string;

/**
 * @param input {Uint8Array} CP932 Binary e.g. [0x94, 0xFC]
 * @return {string} UTF-8 string e.g. "美"
 */
export function decode(input: Uint8Array): string;

/**
 * @param str {string} CP932 URI encoded string e.g. "%94%FC"
 * @return {string} UTF-8 string e.g. "美"
 */
export function decodeURIComponent(str: string): string;
