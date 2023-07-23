// eslint-disable-next-line no-restricted-globals
type SpecTypes = typeof fit | typeof xit | typeof it;
/**
 * @deprecated switch to `parameterize` instead
 */
const getSpecType = <T>(
    value: T,
    isFocused: (value: T) => boolean,
    isDisabled: (value: T) => boolean
): SpecTypes => {
    if (isFocused(value)) {
        // eslint-disable-next-line no-restricted-globals
        return fit;
    }
    if (isDisabled(value)) {
        return xit;
    }
    return it;
};

/**
 * @deprecated switch to `parameterize` instead
 */
export const getSpecTypeByNamedList = <T extends { name: string }>(
    value: T,
    focusList: string[],
    disabledList: string[]
): SpecTypes => getSpecType(
    value,
    (x: T) => focusList.includes(x.name),
    (x: T) => disabledList.includes(x.name)
);

// eslint-disable-next-line no-restricted-globals
type Fit = typeof fit;
type Xit = typeof xit;
type It = typeof it;
/**
 * One of the jasmine spec functions: fit, xit, or it
 */
type Spec = Fit | Xit | It;
/**
 * One of the jasmine spec functions: fit or xit
 */
type SpecOverride = Fit | Xit;

/**
 * Used to create a parameterized test using a an object of test names and test values.
 * In the following example:
 *  - the test named `catsAndDogs` is focused for debugging
 *  - the test named `frogs` is configured to always be disabled
 *  - the test named `men` is configured to run normally
 * @example
 * const rainTests = {
 *     catsAndDogs: 'idiom',
 *     frogs: 'idiom',
 *     men: 'lyrics'
 * } as const;
 * describe('Different rains', () => {
 *     parameterize(rainTests, (spec, name, value) => {
 *         spec(`of type ${name} exist`, () => {
 *             expect(value).toBeDefined();
 *         });
 *     }, {
 *         catsAndDogs: fit,
 *         frogs: xit
 *     });
 * });
 */
export const parameterize = <T extends object>(
    testCases: T,
    test: (spec: Spec, name: keyof T, value: T[keyof T]) => void,
    specOverrides?: {
        [P in keyof T]?: SpecOverride
    }): void => {
    Object.entries(testCases).forEach(testCase => {
        const name = testCase[0] as keyof T;
        const value = testCase[1] as T[keyof T];
        const override = specOverrides?.[name];
        // eslint-disable-next-line no-restricted-globals
        if (override && !(override === fit || override === xit)) {
            throw new Error('Must configure overrides with one of the jasmine spec functions: fit or xit');
        }
        const spec = override ?? it;
        test(spec, name, value);
    });
};
