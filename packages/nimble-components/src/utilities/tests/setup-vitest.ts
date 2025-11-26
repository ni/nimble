/* eslint-disable import/no-extraneous-dependencies, no-console, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import { afterEach, expect } from 'vitest';

// Elevate console errors and warnings to test failures
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
    originalConsoleError(...args);
    throw new Error(`Console error: ${args.map(a => String(a)).join(' ')}`);
};

console.warn = (...args: any[]) => {
    originalConsoleWarn(...args);
    throw new Error(`Console warning: ${args.map(a => String(a)).join(' ')}`);
};

// Add custom matchers
expect.extend({
    toHaveBeenCalledOnceWith(received, ...expectedArgs) {
        const { isNot } = this;
        if (isNot) {
            throw new Error(
                'not.toHaveBeenCalledOnceWith is not supported in this shim'
            );
        }

        const callCount = received.mock.calls.length;
        if (callCount !== 1) {
            return {
                pass: false,
                message: () => `expected spy to be called once, but it was called ${callCount} times`
            };
        }

        const actualArgs = received.mock.calls[0];
        const pass = this.equals(actualArgs, expectedArgs);

        return {
            pass,
            message: () => `expected spy to be called once with ${this.utils.printExpected(expectedArgs)} but was called with ${this.utils.printReceived(actualArgs)}`
        };
    },
    toHaveExactContents(received: any[], expected: any[]) {
        // Note: This implementation does not support .not.toHaveExactContents properly yet if needed

        if (!Array.isArray(received) || !Array.isArray(expected)) {
            return {
                pass: false,
                message: () => 'expected both received and expected to be arrays'
            };
        }

        if (received.length !== expected.length) {
            return {
                pass: false,
                message: () => `expected arrays to have same length. Received: ${received.length}, Expected: ${expected.length}`
            };
        }

        const receivedCopy = [...received];
        for (const item of expected) {
            const index = receivedCopy.findIndex(r => this.equals(r, item));
            if (index === -1) {
                return {
                    pass: false,
                    message: () => `expected array to contain ${this.utils.printExpected(item)}`
                };
            }
            receivedCopy.splice(index, 1);
        }

        return {
            pass: true,
            message: () => 'expected array to have exact contents'
        };
    }
});

// Global cleanup
afterEach(() => {
    document.body.innerHTML = '';
});
