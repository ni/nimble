import { parameterize } from './parameterize.js';
import { ObjectFromNamedList, Suite, SuiteOverride } from './types.js';

/**
 * TODO
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
