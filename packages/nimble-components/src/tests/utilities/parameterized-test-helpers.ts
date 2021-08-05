// eslint-disable-next-line no-restricted-globals
type SpecTypes = typeof fit | typeof xit | typeof it;
export const getSpecType = <T>(
    value: T, isFocused: (T) => boolean, isDisabled: (T) => boolean
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

export const getSpecTypeByList = <T>(
    value: T, focusList: T[], disabledList: T[]
): SpecTypes => getSpecType(value, x => focusList.includes(x), x => disabledList.includes(x));
