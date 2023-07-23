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
 * Used to create a parameterized test using an object of test names and arbitrary test values.
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
        [P in keyof T]?: SpecOverride;
    }
): void => {
    const testCaseNames = Object.keys(testCases) as (keyof T)[];
    if (specOverrides) {
        const overrideNames = Object.keys(
            specOverrides
        ) as (keyof typeof specOverrides)[];
        if (
            !overrideNames.every(overrideName => testCaseNames.includes(overrideName))
        ) {
            throw new Error(
                'Parameterized test override names must match test case name'
            );
        }
        if (
            // eslint-disable-next-line no-restricted-globals
            !overrideNames.every(overrideName => [fit, xit].includes(specOverrides[overrideName]!))
        ) {
            throw new Error(
                'Must configure override with one of the jasmine spec functions: fit or xit'
            );
        }
    }
    testCaseNames.forEach(testCaseName => {
        const spec = specOverrides?.[testCaseName] ?? it;
        test(spec, testCaseName, testCases[testCaseName]);
    });
};

type ObjectFromList<T extends readonly string[]> = {
    [K in T extends readonly (infer U)[] ? U : never]: K;
};

/**
 * Used to create a parameterized test using an array of test names.
 * In the following example:
 *  - the test named `cats-and-dogs` is focused for debugging
 *  - the test named `frogs` is configured to always be disabled
 *  - the test named `men` will run normally as it has no override
 * @example
 * const rainTests = [
 *     'cats-and-dogs',
 *     'frogs',
 *     'men'
 * ] as const;
 * describe('Different rains', () => {
 *     parameterizeList(rainTests, (spec, name) => {
 *         spec(`of type ${name} exist`, () => {
 *             expect(name).toBeDefined();
 *         });
 *     }, {
 *         'cats-and-dogs': fit,
 *         frogs: xit
 *     });
 * });
 */
export const parameterizeList = <T extends readonly string[]>(
    list: T,
    test: (spec: Spec, name: keyof ObjectFromList<T>) => void,
    specOverrides?: {
        [P in keyof ObjectFromList<T>]?: SpecOverride;
    }
): void => {
    const testCases = list.reduce<{ [key: string]: string }>(
        (result, entry) => {
            result[entry] = entry;
            return result;
        },
        {}
    ) as ObjectFromList<T>;
    parameterize(testCases, test, specOverrides);
};
