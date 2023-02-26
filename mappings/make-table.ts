#!/usr/bin/env node

import * as fs from "fs";

function main(src: string, dst: string): void {
    const base = __dirname.replace(/\/[^/]+\/?$/, "");
    if (!src) src = base + "/mappings/CP932.TXT";
    if (!dst) dst = base + "/mappings/cp932.json";
    const map = {} as { [code: string]: string };
    let prev: number;
    let cur: string;
    const check = {} as { [code: string]: boolean };

    console.warn("reading: " + src);
    const table = fs.readFileSync(src, "utf-8");

    table.split(/[\r\n]+/).forEach(line => {
        line = line.replace(/\s*#.*$/, "");
        if (!line.length) return;
        const cols = line.split(/\t/);
        if (cols.length < 2) return;
        const jcode = parseInt(cols[0], 16);
        const ucode = parseInt(cols[1], 16);
        if (check[ucode]) return; // duplicated
        check[ucode] = true;
        const ustr = String.fromCharCode(ucode);

        if (prev + 1 === jcode) {
            map[cur] += ustr;
        } else {
            cur = jcode.toString(16).toUpperCase();
            map[cur] = ustr;
        }
        prev = jcode;
    });

    const json = JSON.stringify(map, null, 1).replace(/\x7F/g, "\\u007F");

    console.warn("writing: " + dst);
    fs.writeFileSync(dst, json);
}

main.apply(null, process.argv.slice(2));
