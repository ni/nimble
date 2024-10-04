import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import { focusVisible } from '../utilities/style/focus';

import {
    borderColor,
    borderHoverColor,
    borderRgbPartialColor,
    bodyFontColor,
    bodyDisabledFontColor,
    controlHeight,
    iconSize,
    borderWidth,
    smallDelay,
    bodyFont,
    smallPadding,
    mediumPadding,
    bodyFontLineHeight
} from '../theme-provider/design-tokens';
import { userSelectNone } from '../utilities/style/user-select';
import { styles as errorStyles } from '../patterns/error/styles';

export const styles = css`
    ${display('inline-flex')}
    ${errorStyles}

    :host {
        font: ${bodyFont};
        outline: none;
        ${userSelectNone}
        min-height: ${controlHeight};
        align-items: center;
    }

    .container {
        position: relative;
        display: grid;
        grid-template-columns: auto auto 1fr auto;
        grid-template-rows: ${bodyFontLineHeight} auto;
        align-items: center;
        width: 100%;
        padding: 0px ${smallPadding};
    }

    .control {
        cursor: pointer;
        width: ${iconSize};
        height: ${iconSize};
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
        grid-column: 1;
        grid-row: 1;
    }

    @media (prefers-reduced-motion) {
        .control {
            transition-duration: 0s;
        }
    }

    :host(${focusVisible}) .control {
        border-color: ${borderHoverColor};
        outline: 2px solid ${borderHoverColor};
        outline-offset: 1px;
    }

    :host([disabled]) .control {
        cursor: default;
        background-color: rgba(${borderRgbPartialColor}, 0.1);
        border-color: rgba(${borderRgbPartialColor}, 0.2);
    }

    :host(:not([disabled]):not(:active)) .control:hover,
    :host(:not([disabled]):not(:active)) .control:has(+ .label:hover) {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    .label {
        cursor: pointer;
        font: inherit;
        color: ${bodyFontColor};
        padding-left: ${mediumPadding};
        grid-column: 2;
        grid-row: 1 / span 2;
    }

    :host([disabled]) .label {
        cursor: default;
        color: ${bodyDisabledFontColor};
    }

    slot[name='checked-indicator'],
    slot[name='indeterminate-indicator'] {
        display: none;
    }

    slot[name='checked-indicator'] svg {
        height: ${iconSize};
        width: ${iconSize};
        overflow: visible;
        fill: ${borderColor};
    }

    :host(.checked:not(.indeterminate)) slot[name='checked-indicator'] {
        display: contents;
    }

    :host([disabled]) slot[name='checked-indicator'] svg {
        fill: rgba(${borderRgbPartialColor}, 0.3);
    }

    slot[name='indeterminate-indicator'] svg {
        height: ${iconSize};
        width: ${iconSize};
        overflow: visible;
        fill: ${borderColor};
    }

    :host(.indeterminate) slot[name='indeterminate-indicator'] {
        display: contents;
    }

    :host([disabled]) slot[name='indeterminate-indicator'] svg {
        fill: rgba(${borderRgbPartialColor}, 0.3);
    }

    .error-icon {
        grid-column: 4;
        grid-row: 1;
        margin-left: ${smallPadding};
    }
`;
