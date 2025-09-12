# Contributing

## Getting Started

Make sure you have the following prerequisites installed:
- [`node.js` LTS release](https://nodejs.org/en/download/)

### Workflows

All workflows are executed from the repo root:

- Installing dependencies:
    ```
    npm install
    ```

- Building:
    ```
    npm run build -w @ni/jasmine-extensions
    ```

- Linting:
    ```
    npm run lint -w @ni/jasmine-extensions
    ```

- Formatting:
    ```
    npm run format -w @ni/jasmine-extensions
    ```

- Packing the package:
    ```
    npm run pack -w @ni/jasmine-extensions
    ```

### Running tests

To build and run tests locally, run `npm run tdd -w @ni/jasmine-extensions`. To run tests without rebuilding, `npm run test -w @ni/jasmine-extensions`.
