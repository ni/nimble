# Contributing to XLIFF to JSON Converter for Angular

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

To build and run tests locally, run `npm run tdd -w @ni/xliff-to-json-converter`. To run tests without rebuilding, `run npm run test -w @ni/xliff-to-json-converter`.

Tests execute using Jasmine's built in test runner (note that unlike most JavaScript/TypeScript projects at NI it doesn't use karma as that is a browser execution environment but this is a Node.js project).

To debug tests:
1. Open the source in VSCode.
2. (Optional) Focus the test of interest by changing `it` to `fit`.
3. Ensure the project has been built.
4. Set a breakpoint in a test or source file under the `dist` directory by clicking in the gutter to the left of the line.
5. Open `package.json`, click the `▷Debug` button above the `scripts` section and select the `test` command.
6. The tests will run using VSCode's debugger.
