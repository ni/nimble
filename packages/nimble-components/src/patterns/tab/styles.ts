import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    borderHoverColor,
    borderWidth,
    bodyFontColor,
    bodyDisabledFontColor,
    controlHeight,
    fillHoverColor,
    fillHoverSelectedColor,
    standardPadding,
    smallDelay
} from '../../theme-provider/design-tokens';
import { focusVisible } from '../../utilities/style/focus';

export const styles = css`
    ${display('inline-flex')}

    :host {
        position: relative;
        box-sizing: border-box;
        font: ${bodyFont};
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

    :host(:hover[aria-selected='true']) {
        background-color: ${fillHoverSelectedColor};
    }

    :host(:focus) {
        outline: none;
    }

    :host(${focusVisible}) {
        outline: none;
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

    :host::before {
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
        :host::before {
            transition-duration: 0.01s;
        }
    }

    :host(${focusVisible})::before {
        width: calc(100% - 2 * var(--ni-private-focus-indicator-inset-width));
    }

    :host::after {
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
        :host::after {
            transition-duration: 0.01s;
        }
    }

    :host(${focusVisible})::after {
        width: 100%;
        border-bottom-width: var(--ni-private-focus-indicator-width);
    }

    :host([aria-selected='true'])::after {
        width: 100%;
        border-bottom-width: var(--ni-private-active-indicator-width);
    }

    :host([aria-selected='true'][disabled])::after {
        border-bottom-color: rgba(${borderHoverColor}, 0.3);
    }
`;
