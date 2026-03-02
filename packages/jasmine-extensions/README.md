# Jasmine Extensions

The `@ni/jasmine-extensions` library provides utility functions to modify the behavior of jasmine specs.

## Getting Started

### Karma

To use as a karma plugin along side `karma-jasmine`, add `@ni/jasmine-extensions` to your karma config as a plugin and list in frameworks.
Note that currently in the `frameworks` field, `jasmine-extensions` needs to come before the `karma-jasmine` defined `frameworks` entry of `jasmine`.

```js

module.exports = {
    // ...
    plugins: [
        require('@ni-private/jasmine-extensions'),
        //...
    ],
    frameworks: [
        'jasmine-extensions', // `jasmine-extensions` needs to be before `jasmine`
        //...
        'jasmine',
        // ...
    ]
}
```

### Jasmine node runner

To use with jasmine node import `applyExtensions` and use from a helper script.

Example `src/setup.js`:

```js
import { applyExtensions } from '@ni-private/jasmine-extensions/apply-extensions';

applyExtensions();
```

Example `jasmine.json`:

```js
{
    /* ... */
    "helpers": [
      "src/setup.js",
    ],
}
```

## Contributing

See `Getting Started` in [`CONTRIBUTING.md`](/packages/jasmine-parameterized/CONTRIBUTING.md#getting-started).
