// eslint-disable-next-line no-restricted-globals
type SpecTypes = typeof fit | typeof xit | typeof it;
/**
 * @deprecated switch to `parameterize` or `parameterizeNamedList` instead
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
 * @deprecated switch to `parameterize` or `parameterizeNamedList` instead
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
// The following aliases are just to reduce the number
// of eslint disables in this source file. In normal
// test code use the globals directly so eslint can
// guard accidental check-ins of fit, etc.
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

type ObjectFromNamedList<T extends readonly { name: string }[]> = {
    [K in T extends readonly { name: infer U }[] ? U : never]: T[number];
};

/**
 * Used to create a parameterized test using an array of tests with names.
 * In the following example:
 *  - the test named `cats-and-dogs` is focused for debugging
 *  - the test named `frogs` is configured to always be disabled
 *  - the test named `men` will run normally as it has no override
 * @example
 * const rainTests = [
 *   { name: 'cats-and-dogs', type: 'idiom' },
 *   { name: 'frogs' type: 'idiom'},
 *   { name: 'men', type: 'lyrics'}
 * ] as const;
 * describe('Different rains', () => {
 *     parameterizeNamedList(rainTests, (spec, name, value) => {
 *         spec(`of type ${name} exist`, () => {
 *             expect(value.type).toBeDefined();
 *         });
 *     }, {
 *         'cats-and-dogs': fit,
 *         frogs: xit
 *     });
 * });
 */
export const parameterizeNamedList = <T extends readonly { name: string }[]>(
    list: T,
    test: (
        spec: Spec,
        name: keyof ObjectFromNamedList<T>,
        value: T[number]
    ) => void,
    specOverrides?: {
        [P in keyof ObjectFromNamedList<T>]?: SpecOverride;
    }
): void => {
    const testCases = list.reduce<{ [key: string]: { name: string } }>(
        (result, entry) => {
            if (result[entry.name]) {
                throw new Error(
                    `Duplicate name found in test case list: ${entry.name}`
                );
            }
            result[entry.name] = entry;
            return result;
        },
        {}
    ) as ObjectFromNamedList<T>;
    parameterize<ObjectFromNamedList<T>>(testCases, test, specOverrides);
};
