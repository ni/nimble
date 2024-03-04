# Generate Workers

This directory contains wafer map rendering code and build scripts which compile it to run in a web worker.

## Behavior

- the `source` directory and `index.ts` are built using `tsc`
- `source/matrix-renderer.ts` is bundled with rollup
- `index.ts` has the purpose to prepare and move `dist/bundle/matrix-renderer` to `src/wafer-map/worker`
- `src/wafer-map/worker/matrix-renderer` will be used to create a `Blob` object which is then used to create a `URL` for a web worker.

## How to run

This script runs as part of `npm run build` but before `npm run build-components`.

To run manually:

1. Run `npm run generate-workers` inside nimble-components directory.
