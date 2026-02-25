import { retryFailedTests } from './retry-failed-tests.js';

declare const TEST_RETRY_COUNT: string | undefined;
const defaultRetryCount = 4;

const retriesString = TEST_RETRY_COUNT ?? '-1';
const retries = parseInt(retriesString, 10);

export function applyExtensions(): void {
    retryFailedTests(
        retries >= 0 ? retries : defaultRetryCount,
        1000
    );
}
