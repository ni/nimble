# Contributing to @ni/xliff-to-json-converter

## Requirements
- [`node.js` LTS release](https://nodejs.org/en/download/) (16.14.2 at the moment, already includes `npm`)

## Workflows

All workflows are executed from the repo root:

- Installing dependencies:
    ```
    npm install
    ```

- Building:
    ```
    npm run build -w @ni/xliff-to-json-converter
    ```

- Linting:
    ```
    npm run lint -w @ni/xliff-to-json-converter
    ```

- Formatting:
    ```
    npm run format -w @ni/xliff-to-json-converter
    ```

- Packing the package:
    ```
    npm run pack -w @ni/xliff-to-json-converter
    ```

### Running tests

To run tests, run `npm run test -w @ni/xliff-to-json-converter`.

Tests using Jasmine's built in test runner (note that unlike most JavaScript/TypeScript projects at NI it doesn't use karma as that is a browser execution environment but this is a Node.js project).

To debug tests:
1. Open the source in VSCode and ensure it has been built.
2. Set a breakpoint in a test under the `dist` directory by clicking in the gutter to the left of the line.
3. Open `package.json`, click the `▷Debug` button above the `scripts` section and select the `test` command.
4. The tests will run using VSCode's debugger.
