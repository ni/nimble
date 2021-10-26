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
    isFocused: (T) => boolean,
    isDisabled: (T) => boolean
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
 * Similar to @see {@link getSpecType} but allows passing a list of focused or disabled tests
 * under the assumption that values can be compared based on `Array.prototype.includes()`.
 * In the following example the test for the `cats` case is focused for debugging
 * and no tests are disabled:
 * @example
 * const rainTypes = ['cats', 'dogs', 'frogs', 'men'];
 * describe('Different rains', () => {
 *     const focused = ['cats'];
 *     const disabled = [];
 *     for (const rainType of rainTypes) {
 *         const specType = getSpecTypeByList(rainType, focused, disabled);
 *         specType(`of type ${rainType} exist`, () => {
 *             expect(rainType).toBeTruthy();
 *         });
 *     }
 * });
 */
export const getSpecTypeByList = <T>(
    value: T,
    focusList: T[],
    disabledList: T[]
): SpecTypes => getSpecType(
    value,
    (x: T) => focusList.includes(x),
    (x: T) => disabledList.includes(x)
);
