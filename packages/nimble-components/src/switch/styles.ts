import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyDisabledFontColor, bodyFont, bodyFontColor, borderHoverColor, borderWidth, controlLabelDisabledFontColor, controlLabelFont, controlLabelFontColor, fillHoverColor, smallDelay, switchBackgroundDisabledColor, switchIndicatorBackgroundColor, switchIndicatorBackgroundDisabledColor, switchIndicatorBorderColor, switchIndicatorBorderDisabledColor } from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('inline-flex')} :host {
        outline: none;
        font: ${bodyFont};
        color: ${bodyFontColor};
        user-select: none;
        flex-direction: column;
        cursor: pointer;
    }

    :host([disabled]) {
        cursor: default;
        color: ${bodyDisabledFontColor}
    }

    .label {
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    :host([disabled]) .label {
        color: ${controlLabelDisabledFontColor};
    }

    .switch-container {
        display: flex;
        align-items: center;
    }

    ::slotted([slot=unchecked-message]) {
        margin-inline-end: 8px;
    }

    .switch {
        display: flex;
        height: 24px;
        width: 48px;
        box-sizing: border-box;
        background-color: ${fillHoverColor};
        border-radius: 12px;
        align-items: center;
    }

    :host([disabled]) .switch {
        background-color: ${switchBackgroundDisabledColor};
    }

    :host(${focusVisible}) .switch {
        border: 2px solid ${borderHoverColor};
    }

    .checked-indicator-spacer {
        flex-grow: 0;
        transition: flex-grow ${smallDelay} ease-in-out
    }

    :host([aria-checked="true"]) .checked-indicator-spacer {
        flex-grow: 1;
        transition: flex-grow ${smallDelay} ease-in-out
    }

    .checked-indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${switchIndicatorBackgroundColor};
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        margin: 4px;
        border: ${borderWidth} solid ${switchIndicatorBorderColor};
    }

    :host(:hover) .checked-indicator {
        border: 2px solid ${borderHoverColor};
    }

    :host([disabled]) .checked-indicator {
        background-color: ${switchIndicatorBackgroundDisabledColor};
        border: ${borderWidth} solid ${switchIndicatorBorderDisabledColor};
    }
    
    :host(${focusVisible}) .checked-indicator {
        border: ${borderWidth} solid ${borderHoverColor};
    }

    .checked-indicator-inner {
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: ${switchIndicatorBorderColor};
        opacity: 0;
        transition: opacity ${smallDelay} ease-in-out;
    }

    :host([disabled]) .checked-indicator-inner {
        background-color: ${switchIndicatorBorderDisabledColor};
    }

    :host([aria-checked="true"]) .checked-indicator-inner {
        opacity: 1;
        transition: opacity ${smallDelay} ease-in-out;
    }

    ::slotted([slot=checked-message]) {
        margin-inline-start: 8px;
    }

    @media (prefers-reduced-motion) {
        .checked-indicator-inner, 
        .checked-indicator-spacer {
            transition-duration: 0s;
        }
    }
`;
