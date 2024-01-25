# Contributing to Jasmine Parameterized

## Requirements
- [`node.js` LTS release](https://nodejs.org/en/download/)

## Workflows

All workflows are executed from the repo root:

- Installing dependencies:
    ```
    npm install
    ```

- Building:
    ```
    npm run build -w @ni/jasmine-parameterized
    ```

- Linting:
    ```
    npm run lint -w @ni/jasmine-parameterized
    ```

- Formatting:
    ```
    npm run format -w @ni/jasmine-parameterized
    ```

- Packing the package:
    ```
    npm run pack -w @ni/jasmine-parameterized
    ```

### Running tests

To build and run tests locally, run `npm run tdd -w @ni/jasmine-parameterized`. To run tests without rebuilding, `run npm run test -w @ni/jasmine-parameterized`.
