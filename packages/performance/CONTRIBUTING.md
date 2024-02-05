# Site

## Overview

To run the site locally:
1. Build the Nimble monorepo.
2. Run `npm run performance -w packages/performance`.
3. Open the URL printed to the console in your web browser.

To add a test:
1. Create a typescript function that appends your component into landing/index.html
2. Put `performance.mark` between the points you want to measure your performance, many examples can be found in landing/index.ts
