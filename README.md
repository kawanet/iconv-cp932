# iconv-cp932

[![Node.js CI](https://github.com/kawanet/iconv-cp932/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/kawanet/iconv-cp932/actions/)
[![npm version](https://badge.fury.io/js/iconv-cp932.svg)](https://badge.fury.io/js/iconv-cp932)

encodeURIComponent and decodeURIComponent for CP932 (Shift_JIS)

## Node.js

```js
const IconvCP932 = require("iconv-cp932");

const unicode = "美しい日本語";

const encoded = IconvCP932.encodeURIComponent(unicode);
console.log(encoded); // => "%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA"

const decoded = IconvCP932.decodeURIComponent(encoded);
console.log(decoded); // => "美しい日本語"
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
- Browser Build - https://cdn.jsdelivr.net/npm/iconv-cp932/public/iconv-cp932.min.js (24KB)
- Live Demo - http://kawanet.github.io/iconv-cp932/demo/

## MIT Licence

Copyright 2014-2021 @kawanet Yusuke Kawasaki

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
