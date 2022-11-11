import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyDisabledFontColor,
    bodyFontColor,
    borderColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    buttonLabelFont,
    controlHeight,
    iconSize,
    smallDelay
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${buttonLabelFont};
        align-items: center;
        outline: none;
        width: fit-content;
        cursor: pointer;
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
        border-radius: 100%;
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

    :host([disabled]) .control {
        background-color: rgba(${borderRgbPartialColor}, 0.1);
        border-color: rgba(${borderRgbPartialColor}, 0.2);
    }

    :host(:not([disabled]):not(:active):hover) .control {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    :host(${focusVisible}) .control {
        border-color: ${borderHoverColor};
    }

    :host(${focusVisible}) .control::after {
        content: '';
        position: absolute;
        width: calc(2px + ${controlHeight} / 2);
        height: calc(2px + ${controlHeight} / 2);
        border: 2px solid ${borderHoverColor};
        border-radius: 100%;
    }

    .label {
        font: inherit;
        color: ${bodyFontColor};
        padding-left: 1ch;
        cursor: inherit;
    }

    :host([disabled]) .label {
        color: ${bodyDisabledFontColor};
    }

    slot[name='checked-indicator'] {
        display: none;
    }

    slot[name='checked-indicator'] svg {
        height: ${iconSize};
        width: ${iconSize};
        overflow: visible;
    }

    :host(.checked) slot[name='checked-indicator'] {
        display: contents;
    }

    slot[name='checked-indicator'] circle {
        fill: ${borderColor};
    }

    :host([disabled]) slot[name='checked-indicator'] circle {
        fill: rgba(${borderRgbPartialColor}, 0.3);
    }
`;
