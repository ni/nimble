# Jasmine Parameterized

The `@ni/jasmine-parameterized` library provides utility functions for writing [Jasmine](https://jasmine.github.io/) parameterized tests.

## Getting Started

Install in your app's `devDependencies`:

```
npm install -D @ni/jasmine-parameterized
```

### Using `parameterizeSpec`

Use `parameterizeSpec` to create a parameterized test using an array of tests with names.

In the following example:

- the test named `cats-and-dogs` is focused for debugging
- the test named `frogs` is configured to always be disabled
- the test named `men` will run normally as it has no override

```ts
import { parameterizeSpec } from '@ni/jasmine-parameterized';
const rainTests = [
    { name: 'cats-and-dogs', type: 'idiom' },
    { name: 'frogs', type: 'idiom'},
    { name: 'men', type: 'lyrics'}
] as const;
describe('Different rains', () => {
    parameterizeSpec(rainTests, (spec, name, value) => {
        spec(`of type ${name} exist`, () => {
            expect(value.type).toBeDefined();
        });
    }, {
        'cats-and-dogs': fit,
        frogs: xit
    });
});
```

### Using `parameterizeSuite`

Use `parameterizeSuite` to create a parameterized test suite using an array of test scenarios with names.

In the following example:

 - the suite named `cats-and-dogs` is focused for debugging
 - the suite named `frogs` is configured to always be disabled
 - the suite named `men` will run normally as it has no override

```ts
import { parameterizeSuite } from '@ni/jasmine-parameterized';
const rainTests = [
    { name: 'cats-and-dogs', type: 'idiom' },
    { name: 'frogs' type: 'idiom'},
    { name: 'men', type: 'lyrics'}
] as const;
parameterizeSuite(rainTests, (suite, name, value) => {
    suite(`with ${name}`, () => {
        it('expect type to be defined', () => {
            expect(value.type).toBeDefined();
        });

        it('expect type to have a non-zero length', () => {
            const length = value.type.length;
            expect(length).toBeGreaterThan(0);
        });
    });
}, {
    'cats-and-dogs': fdescribe,
    frogs: xdescribe
});
```

## Contributing

See `Getting Started` in [`CONTRIBUTING.md`](/packages/jasmine-parameterized/CONTRIBUTING.md#getting-started).
