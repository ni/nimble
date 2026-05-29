import { retryFailedTests } from '../retry-failed-tests.js';

export function applyExtensions(): void {
    retryFailedTests(5, 1000);
}
