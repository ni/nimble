import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import {
    bodyDisabledFontColor,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    buttonLabelFont,
    controlHeight,
    fillHoverColor,
    fillHoverSelectedColor,
    smallDelay,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        position: relative;
        box-sizing: border-box;
        font: ${buttonLabelFont};
        height: ${controlHeight};
        color: ${bodyFontColor};
        align-items: center;
        justify-content: center;
        cursor: pointer;
        --ni-private-active-indicator-width: 2px;
        --ni-private-focus-indicator-width: 1px;
        --ni-private-indicator-lines-gap: 1px;
        --ni-private-focus-indicator-inset-width: 3px;
    }

    :host(:hover) {
        background-color: ${fillHoverColor};
    }

    :host(:hover[aria-current]) {
        background-color: ${fillHoverSelectedColor};
    }

    :host(:active) {
        background: none;
    }

    :host([disabled]) {
        cursor: default;
        color: ${bodyDisabledFontColor};
        background: none;
    }

    slot:not([name]) {
        display: block;
        padding: calc(${standardPadding} / 2) ${standardPadding}
            calc(${standardPadding} / 2 - ${borderWidth});
    }

    a::before {
        content: '';
        position: absolute;
        bottom: calc(
            var(--ni-private-active-indicator-width) +
                var(--ni-private-indicator-lines-gap)
        );
        width: 0px;
        height: 0px;
        border-bottom: ${borderHoverColor}
            var(--ni-private-focus-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        a::before {
            transition-duration: 0s;
        }
    }

    a${focusVisible}::before {
        width: calc(100% - 2 * var(--ni-private-focus-indicator-inset-width));
    }

    a {
        display: inline-flex;
        text-decoration: none;
        color: inherit;
        cursor: inherit;
        outline: none;
        align-items: center;
        justify-content: center;
    }

    a::after {
        content: '';
        position: absolute;
        bottom: 0px;
        width: 0px;
        height: 0px;
        border-bottom: ${borderHoverColor}
            var(--ni-private-active-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        a::after {
            transition-duration: 0s;
        }
    }

    a${focusVisible}::after {
        width: 100%;
        border-bottom-width: var(--ni-private-focus-indicator-width);
    }

    :host([aria-current]) a::after {
        width: 100%;
        border-bottom-width: var(--ni-private-active-indicator-width);
    }

    :host([disabled][aria-current]) a::after {
        border-bottom-color: rgba(${borderHoverColor}, 0.3);
    }

    [part='start'] {
        display: none;
    }

    [part='end'] {
        display: none;
    }
`;
