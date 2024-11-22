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
        align-items: center;
        cursor: pointer;
        outline: none;
        ${userSelectNone}
        min-height: ${controlHeight};
    }

    :host([disabled]) {
        cursor: default;
    }

    .container {
        position: relative;
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: ${bodyFontLineHeight} auto;
        align-items: center;
        width: 100%;
    }

    .control {
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
        padding-left: ${mediumPadding};
        grid-column: 2;
        grid-row: 1 / span 2;
        cursor: inherit;
    }

    :host([disabled]) .label {
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
    }

    :host(.indeterminate) slot[name='indeterminate-indicator'] {
        display: contents;
    }

    slot[name='indeterminate-indicator'] svg {
        fill: ${borderColor};
    }

    :host([disabled]) slot[name='indeterminate-indicator'] svg {
        fill: rgba(${borderRgbPartialColor}, 0.3);
    }

    .error-icon {
        grid-column: 3;
        grid-row: 1;
        margin: 0px ${smallPadding};
    }
`;
