# Performance

## Overview

Performance tests are organized by component. Each component has a separate page build that runs under lighthouse and reports results using [User Timing marks and measures](https://developer.chrome.com/docs/lighthouse/performance/user-timings).

## Getting started

To run the performance tests locally, from workspace root:

1. Build the monorepo with `npm run build`.
2. Run `npm run performance -w packages/performance` to run all the performance tests.
   
   Run specific performance tests by targetting their specific npm command, i.e. `npm run performance:wafer-map -w packages/performance`.
3. When the test is complete a URL will be printed to the console for the published results. Visit the url and see the `User Timing marks and measures` for results.

To run the benchmark page in a browser for development, from workspace root:

1. Build the Nimble monorepo  with `npm run build`.
2. Run the npm start command for the component, such as `npm run start:wafer-map -w packages/performance`.
3. Open the URL printed to the console in your web browser.

## Adding a new component benchmark

Duplicate an existing component benchmark making sure the `package.json` is updated with corresponding component specific `build`, `performance`, and `start` commands.
