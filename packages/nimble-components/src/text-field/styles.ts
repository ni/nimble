import { css } from '@microsoft/fast-element';

import {
    borderColor,
    borderColorHover,
    borderWidth,
    contentFontColorDisabled,
    failColor,
    fillColorSelectedRgb,
    fontFamily,
    labelFontColor,
    labelFontFamily,
    labelFontSize,
    labelTextTransform,
    passwordRevealFilter,
    smallDelay
} from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        display: inline-block;
        font-family: ${fontFamily};
        outline: none;
        user-select: none;
        color: ${labelFontColor};
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
        cursor: default;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        border-radius: 0px;
        font-family: ${fontFamily};
        border-bottom: ${borderWidth} solid ${borderColor};
        transition: border-bottom ${smallDelay};
        align-items: flex-end;
    }

    @media (prefers-reduced-motion) {
        .root {
            transition-duration: 0s;
        }
    }

    .root:hover {
        border-bottom: 2px solid ${borderColorHover};
    }

    :host([invalid]) .root {
        border-bottom: ${borderWidth} solid ${failColor};
    }

    :host([invalid]) .root:hover {
        border-bottom: 2px solid ${failColor};
    }

    :host([disabled]) .root,
    :host([disabled]) .root:hover {
        border-bottom: ${borderWidth} solid ${contentFontColorDisabled};
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
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
        font-style: italic;
        opacity: 0.5;
    }

    .control:focus-within::placeholder {
        opacity: 1;
    }

    .control[disabled]::placeholder {
        color: ${contentFontColorDisabled};
    }

    .label {
        font-family: ${labelFontFamily};
        font-size: ${labelFontSize};
        line-height: 16px;
        text-transform: ${labelTextTransform};
    }

    :host [part='end'] {
        display: none;
    }

    :host([invalid]) [part='end'] {
        align-self: center;
        display: inline-flex;
        padding-left: 0.5em;
        padding-right: 0.5em;
    }

    :host([invalid]) [part='end'] svg {
        height: 16px;
        width: 16px;
    }

    :host([invalid]) [part='end'] path {
        fill: ${failColor};
    }

    :host([disabled]) [part='end'] path {
        fill: ${contentFontColorDisabled};
    }
`;
