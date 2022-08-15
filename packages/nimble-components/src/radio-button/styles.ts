import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyDisabledFontColor, bodyFontColor, borderColor, borderHoverColor, borderRgbPartialColor, borderWidth, buttonLabelFont, controlHeight, iconSize, smallDelay } from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${buttonLabelFont};
        align-items: center;
        outline: none;
    }

    .control {
        width: calc(${controlHeight} / 2);
        height: calc(${controlHeight} / 2);
        box-sizing: border-box;
        flex-shrink: 0;
        border: ${borderWidth} solid ${borderColor};
        border-radius: 999px;
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
        --ni-private-checked-indicator-size: 8px;
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
        outline: 2px solid ${borderHoverColor};
        outline-offset: 1px;
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
        display: inline;
        width: var(--ni-private-checked-indicator-size);
        height: var(--ni-private-checked-indicator-size);
        border-radius: 999px;
        background-color: ${borderColor};
        opacity: 0;
        transition: opacity ${smallDelay} ease-in-out;
    }

    :host(.checked) slot[name='checked-indicator'] {
        opacity: 1;
    }

    :host([disabled]) slot[name='checked-indicator'] {
        background-color: rgba(${borderRgbPartialColor}, 0.2);
    }
`;