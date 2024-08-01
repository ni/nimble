import { Spec, SpecOverride, Suite, SuiteOverride } from './types.js';

/**
 * Used to create a parameterized test or suite using an object of names and arbitrary test values.
 * In the following example:
 *  - the test named `catsAndDogs` is focused for debugging
 *  - the test named `frogs` is configured to always be disabled
 *  - the test named `men` will run normally as it has no override
 * @example
 * const rainTests = {
 *     catsAndDogs: 'idiom',
 *     frogs: 'idiom',
 *     men: 'lyrics'
 * } as const;
 * describe('Different rains', () => {
 *     parameterize('spec', rainTests, (spec, name, value) => {
 *         spec(`of type ${name} exist`, () => {
 *             expect(value).toBeDefined();
 *         });
 *     }, {
 *         catsAndDogs: fit,
 *         frogs: xit
 *     });
 * });
 */
export function parameterize<T extends object>(
    testType: 'spec',
    testCases: T,
    test: (spec: Spec, name: keyof T, value: T[keyof T]) => void,
    overrides?: {
        [P in keyof T]?: SpecOverride;
    }
): void;
export function parameterize<T extends object>(
    testType: 'suite',
    testCases: T,
    test: (spec: Suite, name: keyof T, value: T[keyof T]) => void,
    overrides?: {
        [P in keyof T]?: SuiteOverride;
    }
): void;
export function parameterize<T extends object, U = Spec | Suite>(
    testType: 'spec' | 'suite',
    testCases: T,
    test: (spec: U, name: keyof T, value: T[keyof T]) => void,
    overrides?: {
        [P in keyof T]?: U extends Spec ? SpecOverride : SuiteOverride;
    }
): void {
    const testCaseNames = Object.keys(testCases) as (keyof T)[];
    if (overrides) {
        const overrideNames = Object.keys(
            overrides
        ) as (keyof typeof overrides)[];
        if (
            !overrideNames.every(overrideName => testCaseNames.includes(overrideName))
        ) {
            throw new Error(
                'Parameterized test override names must match test case name'
            );
        }
        if (
            testType === 'spec'
            // eslint-disable-next-line no-restricted-globals
            && !overrideNames.every(overrideName => [fit, xit].includes(overrides[overrideName] as Spec))
        ) {
            throw new Error('Must configure override with one of the jasmine spec functions: fit or xit');
        }
        if (
            testType === 'suite'
            // eslint-disable-next-line no-restricted-globals
            && !overrideNames.every(overrideName => [fdescribe, xdescribe].includes(overrides[overrideName] as Suite))
        ) {
            throw new Error(
                'Must configure override with one of the jasmine suite functions: fdescribe or xdescribe'
            );
        }
    }
    testCaseNames.forEach(testCaseName => {
        const defaultTest = testType === 'spec' ? it : describe;
        const spec = overrides?.[testCaseName] ?? defaultTest;
        test(spec as U, testCaseName, testCases[testCaseName]);
    });
}