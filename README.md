# iconv-cp932

[![Node.js CI](https://github.com/kawanet/iconv-cp932/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/kawanet/iconv-cp932/actions/)
[![npm version](https://badge.fury.io/js/iconv-cp932.svg)](https://badge.fury.io/js/iconv-cp932)

Lightweight Pure JS character encoding conversion for CP932, Shift_JIS, Windows-31J, IBM 932

| method | input encoding | input type | output encoding | output type |
|----|----|----|----|----|
| `encode()` | UTF-8 | `string` | CP932 | `Uint8Array` |
| `decode()` | CP932 | `Uint8Array` | UTF-8 | `string` |
| `encodeURIComponent()` | UTF-8 | `string` | CP932 URL encoded | `string` |
| `decodeURIComponent()` | CP932 URL encoded | `string` | UTF-8 | `string` |

See TypeScript declaration
[iconv-cp932.d.ts](https://github.com/kawanet/iconv-cp932/blob/master/iconv-cp932.d.ts)
for more details.

## Node.js / CommonJS

```js
const IconvCP932 = require("iconv-cp932");

const unicode = "美しい日本語";

const array = IconvCP932.encode(unicode);
console.log(array); // => Uint8Array(12) [ 148, 252, 130, 181, 130, 162, 147, 250, 150, 123, 140, 234 ]

const string = IconvCP932.decode(array);
console.log(string); // => "美しい日本語"

const encoded = IconvCP932.encodeURIComponent(unicode);
console.log(encoded); // => "%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA"

const decoded = IconvCP932.decodeURIComponent(encoded);
console.log(decoded); // => "美しい日本語"
```

## TypeScript / ES Module

```js
import * as IconvCP932 from "iconv-cp932";
```

## Browser

```html
<script src="https://cdn.jsdelivr.net/npm/iconv-cp932/public/iconv-cp932.min.js" charset="utf-8"></script>
<script>
  function tap() {
    const str = document.getElementById("input").value;
    const prefix = "data:application/octet-stream;charset=Shift_JIS,";
    // const prefix = "data:text/comma-separated-values;charset=Shift_JIS,";
    const href = prefix + IconvCP932.encodeURIComponent(str);
    window.open(href, "_blank");
  }
</script>
<textarea id="input" rows="5" cols="60">美しい日本語</textarea>
<button onclick="tap();">CLICK THIS</button>
```

## Links

- Sources on GitHub - https://github.com/kawanet/iconv-cp932
- Browser Build - https://cdn.jsdelivr.net/npm/iconv-cp932/public/iconv-cp932.min.js (25KB)
- Live Demo - http://kawanet.github.io/iconv-cp932/demo/

## MIT Licence

Copyright 2014-2023 @kawanet Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
