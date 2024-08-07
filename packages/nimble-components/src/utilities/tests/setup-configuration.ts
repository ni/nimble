// Scripts that should run at the very beginning of jasmine tests

import { assertAllWaitForEventResolved } from '../testing/component';

// Elevate console errors and warnings to test failures
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (data: any): void => fail(data);
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.warn = (data: any): void => fail(data);

afterAll(() => {
    assertAllWaitForEventResolved();
});
