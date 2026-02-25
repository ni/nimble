import { retryFailedTests } from './retry-failed-tests.js';

declare const TEST_RETRY_COUNT: string | undefined;
const defaultRetryCount = 4;

// Need to check type (rather than just the value), in case the global doesn't exist at all
const retriesString = typeof TEST_RETRY_COUNT !== 'undefined' ? TEST_RETRY_COUNT : '-1';
const retries = parseInt(retriesString, 10);

export function applyExtensions(): void {
    retryFailedTests(
        retries >= 0 ? retries : defaultRetryCount,
        1000
    );
}
