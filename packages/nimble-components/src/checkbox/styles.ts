import { css } from '@microsoft/fast-element';
import { focusVisible } from '@microsoft/fast-foundation';

import {
    borderColor,
    borderColorHover,
    borderColorRgb,
    contentFontSize,
    controlHeight,
    fontColor,
    fontColorDisabled,
    fontFamily
} from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        outline: none;
        user-select: none;
    }

    :host([disabled]) {
        cursor: default;
    }

    .control {
        width: calc(${controlHeight} / 2);
        height: calc(${controlHeight} / 2);
        box-sizing: border-box;
        flex-shrink: 0;
        border: 1px solid ${borderColor};
        padding: 2px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: box-shadow 0.15s;
        ${
            /*
             * Firefox includes the line height in the outline height calculation (not sure if intended or accidental).
             * Set it to 0 to ensure the outline is just as high as the control.
             */ ''
        }
        line-height: 0;
    }

    :host([disabled]) .control {
        background-color: rgba(${borderColorRgb}, 0.1);
        border-color: rgba(${borderColorRgb}, 0.2);
    }

    :host(:not([disabled]):not(:active):hover) .control {
        border-color: ${borderColorHover};
        box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
    }

    :host(:${focusVisible}) .control {
        border-color: ${borderColorHover};
        outline: 2px solid ${borderColorHover};
        outline-offset: 2px;
    }

    .label {
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${fontColor};
        padding-left: 1ch;
        cursor: inherit;
    }

    :host([disabled]) .label {
        color: ${fontColorDisabled};
    }

    slot[name="checked-indicator"] svg {
        height: 10px;
        width: 10px;
    }

    slot[name="checked-indicator"] path {
        fill: ${borderColor};
        opacity: 0;
    }

    :host([aria-checked='true']) slot[name="checked-indicator"] path {
        opacity: 1;
    }

    :host([disabled]) slot[name="checked-indicator"] path {
        fill: rgba(${borderColorRgb}, 0.3);
    }
`;
