import { css } from '@microsoft/fast-element';

import {
    borderColor,
    borderColorHover,
    contentFontSize,
    controlHeight,
    fontColor,
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

    .control {
        width: calc(${controlHeight} / 2);
        height: calc(${controlHeight} / 2);
        box-sizing: border-box;
        flex-shrink: 0;
        border: 1px solid ${borderColor};
        transition: box-shadow 0.15s;
        ${
            /*
             * Firefox includes the line height in the outline height calculation (not sure if intended or accidental).
             * Set it to 0 to ensure the outline is just as high as the control.
             */ ''
        } line-height: 0;
    }

    :host(:hover:not(:active)) .control {
        border-color: ${borderColorHover};
        box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
    }

    :host(:focus-visible) .control {
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

    .checked-indicator {
        width: 100%;
        height: 100%;
        fill: ${borderColor};
        opacity: 0;
    }

    :host([aria-checked='true']) .checked-indicator {
        opacity: 1;
    }
`;
