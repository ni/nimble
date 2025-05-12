import { css } from '@ni/fast-element';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { styles as errorStyles } from '../patterns/error/styles';
import { styles as requiredVisibleStyles } from '../patterns/required-visible/styles';
import {
    bodyDisabledFontColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    controlSlimHeight,
    fillHoverColor,
    fillHoverSelectedColor,
    fillSelectedColor,
    iconColor,
    mediumPadding,
    placeholderFontColor,
    smallPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { DropdownAppearance } from './types';
import { focusVisible } from '../utilities/style/focus';
import { themeBehavior } from '../utilities/style/theme';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';

export const styles = css`
    ${dropdownStyles}
    ${errorStyles}
    ${requiredVisibleStyles}

    ${
        /* We are using flex `order` to define the visual ordering of the selected value,
         error icon, and dropdown arrow because they are not "interactive" i.e. part of the tab order */ ''
    }

    .selected-value {
        order: 1;
    }
    
    .selected-value.placeholder {
        color: ${placeholderFontColor};
    }

    :host([disabled]) .selected-value.placeholder {
        color: ${bodyDisabledFontColor};
    }

    :host([disabled][appearance-readonly]) .selected-value.placeholder {
        color: ${placeholderFontColor};
    }

    .clear-button {
        order: 3;
        height: ${controlSlimHeight};
        margin-left: ${smallPadding};
    }

    [part='indicator'] {
        order: 4;
    }

    .error-icon {
        order: 2;
    }

    [part='end'] {
        display: contents;
    }

    .listbox {
        overflow-x: clip;
    }

    .listbox.above {
        flex-flow: column-reverse;
    }

    .filter-field {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: ${controlHeight};
        background: transparent;
    }

    .filter-field::before {
        content: '';
        position: absolute;
        height: 0px;
        border-bottom: rgba(${borderRgbPartialColor}, 0.1) 2px solid;
        bottom: calc(${controlHeight} + ${smallPadding} - ${borderWidth});
    }

    .filter-field.above::before {
        width: calc(100% - (2 * ${borderWidth}));
    }

    .filter-field::after {
        content: '';
        position: absolute;
        height: 0px;
        border-bottom: rgba(${borderRgbPartialColor}, 0.1) 2px solid;
        top: calc(${controlHeight} + ${smallPadding} - ${borderWidth});
    }

    .filter-field:not(.above)::after {
        width: calc(100% - (2 * ${borderWidth}));
    }

    .filter-icon {
        flex-shrink: 0;
        margin-left: ${smallPadding};
        ${iconColor.cssCustomProperty}: ${placeholderFontColor};
    }

    .filter-input {
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        height: var(--ni-nimble-control-height);
        padding: 0 ${smallPadding} 0 ${mediumPadding};
        width: 100%;
    }

    .filter-input::placeholder {
        color: ${placeholderFontColor};
    }

    .filter-input${focusVisible} {
        outline: 0px;
    }

    ::slotted([role='option']) {
        background-color: transparent;
    }

    ::slotted([role='option']:hover) {
        background-color: ${fillHoverColor};
    }

    ::slotted([role='option'][active-option]) {
        background-color: ${fillSelectedColor};
    }

    ::slotted([role='option'][active-option]:hover) {
        background-color: ${fillHoverSelectedColor};
    }

    .loading-container {
        padding-left: ${mediumPadding};
        padding-right: ${mediumPadding};
        display: flex;
        height: ${controlHeight};
        flex: 1 0 auto;
    }

    .loading-container.above {
        align-items: end;
        padding-bottom: ${smallPadding};
    }

    .loading-container.below {
        align-items: normal;
        padding-top: ${smallPadding};
    }

    .loading-container.empty {
        padding: ${smallPadding} ${mediumPadding};
        align-items: center;
    }

    .loading-label {
        color: ${placeholderFontColor};
    }

    .loading-spinner {
        margin-left: auto;
    }
`.withBehaviors(
    appearanceBehavior(
        DropdownAppearance.block,
        css`
            :host([error-visible]) .control {
                border-bottom-width: ${borderWidth};
                padding-bottom: 0;
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            .filter-field,
            .no-results-label,
            .loading-container {
                background: ${hexToRgbaCssColor(White, 0.15)};
            }
        `
    )
);
