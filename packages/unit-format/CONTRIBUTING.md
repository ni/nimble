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
    npm run build -w @ni/unit-format
    ```

- Linting:
    ```
    npm run lint -w @ni/unit-format
    ```

- Formatting:
    ```
    npm run format -w @ni/unit-format
    ```

- Packing the package:
    ```
    npm run pack -w @ni/unit-format
    ```

### Running tests

To build and run tests locally, run `npm run tdd -w @ni/unit-format`. To run tests without rebuilding, `npm run test -w @ni/unit-format`.
