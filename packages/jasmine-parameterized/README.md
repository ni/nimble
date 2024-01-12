# Jasmine Parameterized

The `@ni/jasmine-parameterized` library provides utility functions for writing [Jasmine](https://jasmine.github.io/) parameterized tests.

# Usage

1. Install in your app's `devDependencies`:

    ```
    npm install -D @ni/jasmine-parameterized
    ```

2. Use either `parameterize` or `parameterizeNamedList` to write strictly-typed jasmine tests that run for different test scenarios, where each test can be focused or excluded as needed by name.

### `parameterize`
Use `parameterize` to create a parameterized test using an object of test names and arbitrary test values.

In the following example:
 - the test named `catsAndDogs` is focused for debugging
 - the test named `frogs` is configured to always be disabled
 - the test named `men` will run normally as it has no override

```ts
const rainTests = {
    catsAndDogs: 'idiom',
    frogs: 'idiom',
    men: 'lyrics'
} as const;
describe('Different rains', () => {
    parameterize(rainTests, (spec, name, value) => {
        spec(`of type ${name} exist`, () => {
            expect(value).toBeDefined();
        });
    }, {
        catsAndDogs: fit,
        frogs: xit
    });
});
```

### `parameterizeNamedList`
Use `parameterizeNamedList` to create a parameterized test using an array of tests with names.

In the following example:
    - the test named `cats-and-dogs` is focused for debugging
    - the test named `frogs` is configured to always be disabled
    - the test named `men` will run normally as it has no override

```ts
const rainTests = [
    { name: 'cats-and-dogs', type: 'idiom' },
    { name: 'frogs' type: 'idiom'},
    { name: 'men', type: 'lyrics'}
] as const;
describe('Different rains', () => {
    parameterizeNamedList(rainTests, (spec, name, value) => {
        spec(`of type ${name} exist`, () => {
            expect(value.type).toBeDefined();
        });
    }, {
        'cats-and-dogs': fit,
        frogs: xit
    });
});
```
