import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColor,
    borderColorRgbPartial,
    borderColorHover,
    borderWidth,
    bodyFontColor,
    bodyFontColorDisabled,
    controlHeight,
    fillColorSelectedRgbPartial,
    iconSize,
    controlLabelFont,
    controlLabelFontColor,
    labelHeight,
    smallDelay,
    bodyFont
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        font: ${bodyFont};
        outline: none;
        user-select: none;
        color: ${bodyFontColor};
        height: calc(${labelHeight} + ${controlHeight});
    }

    :host([disabled]) {
        color: ${bodyFontColorDisabled};
        cursor: default;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        border-radius: 0px;
        border-bottom: ${borderWidth} solid rgba(${borderColorRgbPartial}, 0.3);
        padding-bottom: 1px;
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
    }

    @media (prefers-reduced-motion) {
        .root {
            transition-duration: 0s;
        }
    }

    .root:hover {
        border-bottom: 2px solid ${borderColorHover};
        padding-bottom: 0px;
    }

    :host([disabled]) .root,
    :host([disabled]) .root:hover {
        border-bottom: ${borderWidth} solid ${bodyFontColorDisabled};
        padding-bottom: 1px;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        color: inherit;
        height: 28px;
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
    }

    .control:hover,
    .control:focus,
    .control:disabled,
    .control:active {
        outline: none;
    }

    .control::selection {
        color: ${controlLabelFontColor};
        background: rgba(${fillColorSelectedRgbPartial}, 0.3);
    }

    .control::placeholder {
        color: ${controlLabelFontColor};
    }

    .control:focus-within::placeholder {
        opacity: 1;
    }

    .control[disabled]::placeholder {
        color: ${bodyFontColorDisabled};
    }

    .label {
        display: flex;
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    .controls {
        display: flex;
        flex-direction: column;
    }

    .step-up,
    .step-down {
        display: inline-flex;
        height: 15px;
        width: 15px;
        cursor: pointer;
        justify-content: center;
        align-items: center;
    }

    .step-up svg,
    .step-down svg {
        height: ${iconSize};
        width: ${iconSize};
        fill: ${borderColor};
    }
`;
