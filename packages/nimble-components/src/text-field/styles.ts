import { css } from '@microsoft/fast-element';

import {
    borderColor,
    borderColorHover,
    borderWidth,
    contentFontColorDisabled,
    contentFontSize,
    controlHeight,
    failColor,
    fillColorSelectedRgb,
    fontFamily,
    iconSize,
    labelFontColor,
    labelFontFamily,
    labelFontSize,
    labelHeight,
    labelTextTransform,
    passwordRevealFilter,
    smallDelay
} from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        display: inline-block;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        outline: none;
        user-select: none;
        color: ${labelFontColor};
        height: calc(${labelHeight} + ${controlHeight});
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        border-radius: 0px;
        font-family: ${fontFamily};
        border-bottom: ${borderWidth} solid ${borderColor};
        padding-bottom: 1px;
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
        align-items: flex-end;
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

    :host(.invalid) .root {
        border-bottom: ${borderWidth} solid ${failColor};
    }

    :host(.invalid) .root:hover {
        border-bottom: 2px solid ${failColor};
        padding-bottom: 0px;
    }

    :host([disabled]) .root,
    :host([disabled]) .root:hover {
        border-bottom: ${borderWidth} solid ${contentFontColorDisabled};
        padding-bottom: 0px;
    }

    :host([readonly]) .root,
    :host([readonly]) .root:hover {
        border: none;
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

    .control::-ms-reveal {
        filter: ${passwordRevealFilter};
    }

    .control:hover,
    .control:focus,
    .control:disabled,
    .control:active {
        outline: none;
    }

    .control::selection {
        color: ${labelFontColor};
        background: rgba(${fillColorSelectedRgb}, 0.3);
    }

    .control::placeholder {
        color: ${labelFontColor};
        opacity: 0.6;
    }

    .control:not([readonly]):focus-within::placeholder {
        opacity: 1;
    }

    .control[readonly] {
        cursor: default;
    }

    .control[disabled]::placeholder {
        color: ${contentFontColorDisabled};
    }

    .label {
        display: flex;
        font-family: ${labelFontFamily};
        font-size: ${labelFontSize};
        line-height: ${labelHeight};
        text-transform: ${labelTextTransform};
    }

    :host [part='end'] {
        display: none;
    }

    :host(.invalid) [part='end'] {
        align-self: center;
        display: inline-flex;
        padding-left: 8px;
        padding-right: 8px;
    }

    :host(.invalid) [part='end'] svg {
        height: ${iconSize};
        width: ${iconSize};
    }

    :host(.invalid) [part='end'] path {
        fill: ${failColor};
    }

    :host([disabled]) [part='end'] path {
        fill: ${contentFontColorDisabled};
    }
`;
