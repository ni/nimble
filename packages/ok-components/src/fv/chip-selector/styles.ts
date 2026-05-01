import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    controlLabelDisabledFontColor,
    controlLabelFont,
    controlLabelFontColor,
    fillHoverColor,
    fillSelectedColor,
    iconColor,
    placeholderFontColor,
    smallDelay,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('inline-block')}

    :host {
        width: 300px;
        max-width: 100%;
        box-sizing: border-box;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .chip-selector {
        position: relative;
        width: 100%;
    }

    .label {
        display: flex;
        margin-block-end: ${smallPadding};
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    .chip-selector-field {
        position: relative;
        display: flex;
        align-items: stretch;
        min-height: ${controlHeight};
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        background: transparent;
        transition:
            border-color ${smallDelay} ease-in-out;
    }

    .chip-selector-field::before {
        content: '';
        position: absolute;
        inset-inline: 0;
        inset-block-end: -1px;
        height: 1px;
        background: transparent;
        pointer-events: none;
        transition: background-color ${smallDelay} ease-in-out;
    }

    .chip-selector-field::after {
        content: '';
        position: absolute;
        inset-inline: 0;
        inset-block-end: -1px;
        height: 2px;
        background: transparent;
        pointer-events: none;
        transition:
            background-color ${smallDelay} ease-in-out;
    }

    .chip-selector-field:hover::after {
        background: ${borderHoverColor};
    }

    .chip-selector-field:focus-within::before,
    :host([open]) .chip-selector-field::before {
        background: ${borderHoverColor};
    }

    .chip-selector-field:focus-within,
    :host([open]) .chip-selector-field {
        border-bottom-color: transparent;
    }

    .chip-selector-field:focus-within::after,
    :host([open]) .chip-selector-field::after {
        background: transparent;
    }

    .chip-selector-selection-area {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        flex-wrap: wrap;
        align-items: center;
        gap: ${smallPadding};
        min-width: 0;
        padding: ${smallPadding} ${standardPadding} ${smallPadding} ${smallPadding};
        box-sizing: border-box;
    }

    .chip-selector-selection-area::after {
        content: '';
        position: absolute;
        inset-block: ${smallPadding};
        inset-inline-end: 0;
        width: 2px;
        background: rgba(${borderRgbPartialColor}, 0.2);
    }

    /* Target only the picker's internal chips, not slotted client content. */
    .chip-selector-selection-area > nimble-chip {
        ${controlHeight.cssCustomProperty}: 24px;
        min-width: 0;
        max-width: calc(100% - ${smallPadding});
    }

    .chip-selector-input {
        -webkit-appearance: none;
        appearance: none;
        flex: 1 1 0;
        min-width: 0;
        width: 0;
        padding: 0;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        outline: none;
    }

    .chip-selector-input::placeholder {
        color: ${placeholderFontColor};
    }

    .chip-selector-menu-button {
        ${controlHeight.cssCustomProperty}: 24px;
        align-self: flex-start;
        margin-block: ${smallPadding};
        margin-inline: ${smallPadding};
    }

    .chip-selector-menu-icon {
        ${iconColor.cssCustomProperty}: currentColor;
    }

    .chip-selector-menu {
        position: absolute;
        inset-inline: 0;
        inset-block-start: calc(100% + ${smallPadding});
        display: flex;
        flex-direction: column;
        max-height: 192px;
        overflow-y: auto;
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        background: ${applicationBackgroundColor};
        box-shadow: 0 2px 10px rgb(0 0 0 / 14%);
        z-index: 2;
    }

    .chip-selector-menu[hidden] {
        display: none;
    }

    .chip-selector-option {
        -webkit-appearance: none;
        appearance: none;
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
        min-height: ${controlHeight};
        padding: 0 ${standardPadding};
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }

    .chip-selector-option:hover,
    .chip-selector-option.active {
        background: ${fillHoverColor};
    }

    .chip-selector-option:active {
        background: ${fillSelectedColor};
    }

    .chip-selector-option:focus-visible {
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -1px;
    }

    .chip-selector-create-option {
        border-top: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.12);
    }

    .chip-selector-empty {
        padding: ${smallPadding} ${standardPadding};
        color: ${placeholderFontColor};
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
    }

    :host([disabled]) .label {
        color: ${controlLabelDisabledFontColor};
    }

    :host([disabled]) .chip-selector-field {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
        background: rgba(${borderRgbPartialColor}, 0.07);
    }

    :host([disabled]) .chip-selector-field::after {
        background: transparent;
    }

    :host([disabled]) .chip-selector-menu-button,
    :host([disabled]) .chip-selector-input {
        cursor: not-allowed;
    }
`;