import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';

import {
    borderColor,
    borderColorHover,
    borderColorRgbPartial,
    contentFontColor,
    contentFontColorDisabled,
    controlHeight,
    iconSize,
    borderWidth,
    smallDelay,
    buttonLabel1Font
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
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
        border: ${borderWidth} solid ${borderColor};
        padding: 2px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: box-shadow ${smallDelay};
        ${
            /*
             * Firefox includes the line height in the outline height calculation (not sure if intended or accidental).
             * Set it to 0 to ensure the outline is just as high as the control.
             */ ''
        }
        line-height: 0;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    :host([disabled]) .control {
        background-color: rgba(${borderColorRgbPartial}, 0.1);
        border-color: rgba(${borderColorRgbPartial}, 0.2);
    }

    :host(:not([disabled]):not(:active):hover) .control {
        border-color: ${borderColorHover};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderColorHover} inset;
    }

    :host(${focusVisible}) .control {
        border-color: ${borderColorHover};
        outline: 2px solid ${borderColorHover};
        outline-offset: 2px;
    }

    .label {
        font: ${buttonLabel1Font};
        color: ${contentFontColor};
        padding-left: 1ch;
        cursor: inherit;
    }

    :host([disabled]) .label {
        color: ${contentFontColorDisabled};
    }

    slot[name='checked-indicator'] svg {
        height: ${iconSize};
        width: ${iconSize};
        overflow: visible;
    }

    slot[name='checked-indicator'] path {
        fill: ${borderColor};
        opacity: 0;
    }

    :host([aria-checked='true']) slot[name='checked-indicator'] path {
        opacity: 1;
    }

    :host([disabled]) slot[name='checked-indicator'] path {
        fill: rgba(${borderColorRgbPartial}, 0.3);
    }
`;
