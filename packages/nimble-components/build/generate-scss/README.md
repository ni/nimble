# Generate SCSS

## Behavior

- Depends on the build output of the `npm run build-components` command to generate design token names.
- Generates SCSS files in the nimble component dist with the design token names formatted as SCSS properties.
- Generates an SCSS file for fonts that imports from Nimble Tokens.

## How to run

This script runs as part of the Nimble Components build.

To run manually:

1. Run a Nimble Components build (only need to re-rerun if making components changes).
2. Edit `index.js` for this script and run `npm run generate-scss` (can re-run when modifying `index.js` behavior).

## Modifying tokens

See [CSS Guidelines: Design Tokens](/packages/nimble-components/docs/css-guidelines.md#design-tokens)
