// Scripts that should run at the very beginning of jasmine tests
import { applyExtensions } from '@ni-private/jasmine-extensions';

applyExtensions();

// Elevate console errors and warnings to test failures
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (data: any): void => fail(data);
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.warn = (data: any): void => fail(data);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

// Headless Chrome is missing some styles on the document element.
// Without this, the <html> element has a height of 8px, which can cause some tests to fail.
document.documentElement.style.setProperty('height', '100%');
