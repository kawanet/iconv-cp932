/**
 * iconv-cp932
 *
 * @see https://www.npmjs.com/package/iconv-cp932
 */

export const UNKNOWN: string;

/**
 * @param str {string} UTF-8 string e.g. "美"
 * @return {string} CP932 URI encoded string e.g. "%94%FC"
 */
export function encodeURIComponent(str: string): string;

/**
 * @param str {string} CP932 URI encoded string e.g. "%94%FC"
 * @return {string} UTF-8 string e.g. "美"
 */
export function decodeURIComponent(str: string): string;
