/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-interface, @typescript-eslint/no-shadow */
import type {
    Assertion,
    AsymmetricMatchersContaining,
    ArrayLikeMatchers
} from 'vitest';

interface CustomMatchers<R = unknown> {
    toHaveBeenCalledOnceWith(...args: any[]): R;
    toHaveExactContents(expected: readonly any[]): R;
    toHaveLength(expected: number): R;
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
    interface ArrayLikeMatchers<T = any> extends CustomMatchers<T> {}
}

declare module '@vitest/expect' {
    interface Assertion<T = any> extends CustomMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
    interface ArrayLikeMatchers<T = any> extends CustomMatchers<T> {}
}

declare global {
    namespace jasmine {
        type Matchers<T> = CustomMatchers<T>;
        type ArrayLikeMatchers<T> = CustomMatchers<T>;
    }
}
