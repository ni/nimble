# Generate Icons

## Behavior

- Depends on the build output of `nimble-components` to generate Blazor versions of enums
- Generates a `.cs` file for each enum type specified in the `source/index.js` file.

## How to run

This script runs as part of the Nimble Blazor build.

To run manually:

1. Run a Nimble Blazor build.
2. Edit `index.js` for this script and run `npm run generate-enums` (can re-run when modifying `index.js` behavior).
