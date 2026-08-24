import * as assert from 'node:assert/strict';
import { assertLocalSvgReferences } from './validate-assets';

assert.doesNotThrow(() =>
  assertLocalSvgReferences(
    '<svg><use href="#mark"/><image href="./local.png"/><style>.a{fill:url(#paint)}</style></svg>',
    'local.svg',
  ),
);

for (const content of [
  '<svg><use href="//cdn.example/mark.svg"/></svg>',
  '<svg><style>.a{fill:url(https://cdn.example/paint.svg)}</style></svg>',
  '<svg><style>@import "https://cdn.example/style.css";</style></svg>',
  '<svg><style>@import/**/"https://cdn.example/obfuscated.css";</style></svg>',
  String.raw`<svg><style>@im\70 ort "https://cdn.example/escaped.css";</style></svg>`,
  '<svg><image href="data:image/png;base64,AAAA"/></svg>',
]) {
  assert.throws(
    () => assertLocalSvgReferences(content, 'external.svg'),
    /contains a non-local reference/,
  );
}

console.log('SVG reference validation tests passed.');
