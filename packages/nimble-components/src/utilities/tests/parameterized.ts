// eslint-disable-next-line no-restricted-globals
type SpecTypes = typeof fit | typeof xit | typeof it;
/**
 * Used to focus or disable specific tests in a parameterized test run.
 * In the following example the test for the `cats` case is focused for debugging
 * and no tests are disabled:
 * @example
 * const rainTypes = ['cats', 'dogs', 'frogs', 'men'];
 * describe('Different rains', () => {
 *     const isFocused = rainType => rainType === 'cats';
 *     const isDisabled = () => false;
 *     for (const rainType of rainTypes) {
 *         const specType = getSpecType(rainType, isFocused, isDisabled);
 *         specType(`of type ${rainType} exist`, () => {
 *             expect(rainType).toBeTruthy();
 *         });
 *     }
 * });
 */
export const getSpecType = <T>(
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
 * Similar to @see {@link getSpecType} but allows passing a list of named objects.
 * In the following example the test for the `cats-and-dogs` case is focused for debugging
 * and no tests are disabled:
 * @example
 * const rainTypes = [
 *   { name: 'cats-and-dogs', type: 'idiom' },
 *   { name: 'frogs' type: 'idiom'},
 *   { name: 'men', type: 'lyrics'}
 * ];
 * describe('Different rains', () => {
 *     const focused = ['cats-and-dogs'];
 *     const disabled = [];
 *     for (const rainType of rainTypes) {
 *         const specType = getSpecTypeByNamedList(rainType, focused, disabled);
 *         specType(`of type ${rainType.name} exist`, () => {
 *             expect(rainType.type).toBeDefined();
 *         });
 *     }
 * });
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
