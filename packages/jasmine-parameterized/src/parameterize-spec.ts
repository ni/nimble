import { parameterize } from './parameterize.js';
import { ObjectFromNamedList, Spec, SpecOverride } from './types.js';

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
 *     parameterizeSpec(rainTests, (spec, name, value) => {
 *         spec(`of type ${name} exist`, () => {
 *             expect(value.type).toBeDefined();
 *         });
 *     }, {
 *         'cats-and-dogs': fit,
 *         frogs: xit
 *     });
 * });
 */
export const parameterizeSpec = <T extends readonly { name: string }[]>(
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
                    `Duplicate name found in test case list: ${entry.name}. Make sure all test names are unique.`
                );
            }
            result[entry.name] = entry;
            return result;
        },
        {}
    ) as ObjectFromNamedList<T>;
    parameterize<ObjectFromNamedList<T>>('spec', testCases, test, specOverrides);
};
