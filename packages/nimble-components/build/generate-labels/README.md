# Generate Icons

## Behavior

- Depends on `labels.json` to generate label (string resource) source files in `src/labels`
- Generates a `labels.ts` with a `DesignToken` for each label/string, and `theme-provider-base` (a base class for ThemeProvider that declares attributes for each label/string).

## How to run

This script runs as part of the Nimble Components build.

To run manually:

1. Run a Nimble Components build (only need to re-rerun if making components changes).
2. Edit `index.js` for this script and run `npm run generate-labels` (can re-run when modifying `index.js` behavior).
