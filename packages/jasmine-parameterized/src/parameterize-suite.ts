import { parameterize } from './parameterize.js';
import { ObjectFromNamedList, Suite, SuiteOverride } from './types.js';

/**
 * Used to create a parameterized suite using an array of test scenarios with names.
 * In the following example:
 *  - the suite named `cats-and-dogs` is focused for debugging
 *  - the suite named `frogs` is configured to always be disabled
 *  - the suite named `men` will run normally as it has no override
 * @example
* const rainTests = [
*   { name: 'cats-and-dogs', type: 'idiom' },
*   { name: 'frogs' type: 'idiom'},
*   { name: 'men', type: 'lyrics'}
* ] as const;
* parameterizeSuite(rainTests, (suite, name, value) => {
*     suite(`with ${name}`, () => {
*         it('expect type to be defined', () => {
*             expect(value.type).toBeDefined();
*         });
*
*         it('expect type to have a non-zero length', () => {
*             const length = value.type.length;
*             expect(length).toBeGreaterThan(0);
*         });
*     });
* }, {
*     'cats-and-dogs': fdescribe,
*     frogs: xdescribe
* });
*/
export const parameterizeSuite = <T extends readonly { name: string }[]>(
    list: T,
    test: (
        suite: Suite,
        name: keyof ObjectFromNamedList<T>,
        value: T[number]
    ) => void,
    specOverrides?: {
        [P in keyof ObjectFromNamedList<T>]?: SuiteOverride;
    }
): void => {
    const testCases = list.reduce<{ [key: string]: { name: string } }>(
        (result, entry) => {
            if (result[entry.name]) {
                throw new Error(
                    `Duplicate name found in test suite list: ${entry.name}. Make sure all test suite names are unique.`
                );
            }
            result[entry.name] = entry;
            return result;
        },
        {}
    ) as ObjectFromNamedList<T>;
    parameterize<ObjectFromNamedList<T>>(testCases, test, describe, specOverrides);
};
