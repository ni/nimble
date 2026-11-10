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
    controlSlimHeight,
    controlLabelFont,
    controlLabelFontColor,
    elevation2BoxShadow,
    fillHoverColor,
    fillHoverSelectedColor,
    fillSelectedColor,
    iconColor,
    mediumPadding,
    placeholderFontColor,
    popupBorderColor,
    smallDelay,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { focusVisible } from '@ni/nimble-components/dist/esm/utilities/style/focus';
import { themeBehavior } from '@ni/nimble-components/dist/esm/utilities/style/theme';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('inline-block')}

    :host {
        width: 300px;
        max-width: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .label {
        display: block;
        margin-bottom: ${smallPadding};
        font: ${controlLabelFont};
        color: ${controlLabelFontColor};
    }

    .control-field {
        position: relative;
        display: flex;
        align-items: center;
        gap: ${smallPadding};
        width: 100%;
        height: ${controlHeight};
        box-sizing: border-box;
        padding: 0 ${standardPadding};
        border: ${borderWidth} solid transparent;
        border-bottom-color: rgba(${borderRgbPartialColor}, 0.3);
        border-radius: 0;
        font: inherit;
        color: inherit;
        background: transparent;
        text-align: start;
        cursor: pointer;
    }

    .control {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        height: 100%;
        padding: 0;
        border: none;
        font: inherit;
        color: inherit;
        background: transparent;
        text-align: start;
        cursor: inherit;
        outline: none;
    }

    .clear-button {
        flex: none;
        height: ${controlSlimHeight};
    }

    :host([appearance='outline']) .control-field {
        border-color: rgba(${borderRgbPartialColor}, 0.3);
    }

    :host([appearance='block']) .control-field {
        background: rgba(${borderRgbPartialColor}, 0.1);
        border-color: transparent;
    }

    :host([appearance='frameless']) .control-field {
        border-color: transparent;
    }

    :host([open]:not(:hover)) .control-field {
        border-bottom-color: ${borderHoverColor};
    }

    .control-field::before,
    .control-field::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        pointer-events: none;
        transition: width ${smallDelay} ease-in;
    }

    .control-field::before {
        bottom: calc(${borderWidth} + 1px);
        border-bottom: 1px solid ${borderHoverColor};
    }

    .control-field::after {
        bottom: calc(-1 * ${borderWidth});
        border-bottom: calc(${borderWidth} + 1px) solid ${borderHoverColor};
    }

    :host(:not([disabled])) .control-field:has(.control${focusVisible})::before {
        width: calc(100% - 8px);
    }

    :host(:not([disabled])) .control-field:hover::after,
    :host(:not([disabled])) .control-field:has(.control${focusVisible})::after {
        width: 100%;
    }

    @media (prefers-reduced-motion) {
        .control-field::before,
        .control-field::after {
            transition-duration: 0s;
        }
    }

    .selected-value {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .placeholder,
    .empty {
        color: ${placeholderFontColor};
    }

    .anchored-region.bottom {
        padding-top: ${smallPadding};
    }

    .anchored-region.top {
        padding-bottom: ${smallPadding};
    }

    .popup {
        width: 100%;
        box-sizing: border-box;
        border: ${borderWidth} solid ${popupBorderColor};
        background: ${applicationBackgroundColor};
        box-shadow: ${elevation2BoxShadow};
    }

    .filter-field {
        display: flex;
        align-items: center;
        height: ${controlHeight};
        background: transparent;
        box-shadow: 0 2px rgba(${borderRgbPartialColor}, 0.1);
    }

    .filter-icon {
        flex-shrink: 0;
        margin-left: ${smallPadding};
        ${iconColor.cssCustomProperty}: ${placeholderFontColor};
    }

    .filter-input {
        width: 100%;
        min-width: 0;
        height: ${controlHeight};
        padding: 0 ${smallPadding} 0 ${mediumPadding};
        border: none;
        outline: none;
        font: inherit;
        color: inherit;
        background: transparent;
    }

    .filter-input::placeholder {
        color: ${placeholderFontColor};
    }

    .listbox {
        max-height: 240px;
        overflow-y: auto;
        outline: none;
    }

    .option {
        display: flex;
        align-items: center;
        gap: ${smallPadding};
        min-height: ${controlHeight};
        padding: 0 ${standardPadding};
        cursor: pointer;
    }

    .option-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .option nimble-checkbox {
        flex: none;
        pointer-events: none;
    }

    .option:not([aria-disabled='true']):hover {
        background: ${fillHoverColor};
    }

    .keyboard-navigation .option.active {
        background: ${fillSelectedColor};
    }

    .keyboard-navigation .option.active:hover {
        background: ${fillHoverSelectedColor};
    }

    :host([disabled]) .control-field,
    :host([disabled]) .label,
    .option[aria-disabled='true'] {
        color: ${bodyDisabledFontColor};
        cursor: default;
    }

    :host([disabled]) .control-field {
        ${iconColor.cssCustomProperty}: ${bodyDisabledFontColor};
    }

    .empty {
        padding: ${standardPadding};
    }
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            .filter-field {
                background: rgba(255, 255, 255, 0.15);
            }
        `
    )
);
