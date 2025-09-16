// eslint-disable-next-line import/no-useless-path-segments
import { applyExtensions } from '../index.js';

applyExtensions();

// Elevate console errors and warnings to test failures
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (data: any): void => fail(data);
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.warn = (data: any): void => fail(data);
