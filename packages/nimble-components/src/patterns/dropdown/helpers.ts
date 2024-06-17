import {
    controlHeight as controlHeightToken,
    smallPadding
} from '../../theme-provider/design-tokens';

const maxVisibleOptions = 10.5;

export function getDropdownMaxHeight(
    element: HTMLElement,
    filterVisible: boolean
): number {
    const controlHeight = parseInt(controlHeightToken.getValueFor(element), 10);
    const listboxInnerPadding = parseInt(smallPadding.getValueFor(element), 10);
    const listboxGap = listboxInnerPadding; // both use smallPadding
    const listboxBorderHeight = 2; // 1px top and bottom
    const filterHeight = filterVisible ? controlHeight : 0;
    return (
        controlHeight * maxVisibleOptions
        + listboxGap
        + listboxBorderHeight
        + filterHeight
        + listboxInnerPadding
    );
}
