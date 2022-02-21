import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    borderHoverColor,
    borderWidth,
    bodyFontColor,
    bodyFontDisabledColor,
    controlHeight,
    fillHoverColor,
    mediumDelay,
    standardPadding
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('inline-flex')}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
        height: ${controlHeight};
        padding: calc(${standardPadding} / 2) ${standardPadding}
            calc(${standardPadding} / 2 - ${borderWidth});
        color: ${bodyFontColor};
        align-items: center;
        justify-content: center;
        cursor: pointer;
        ${/* Separate focus indicator from active indicator */ ''}
        border-bottom: transparent ${borderWidth} solid;
    }

    :host(:hover) {
        background-color: ${fillHoverColor};
    }

    :host(:focus) {
        outline: none;
    }

    :host(${focusVisible}) {
        outline: none;
        box-shadow: 0 calc(${borderWidth} * -1) ${borderHoverColor} inset;
        transition: box-shadow ${mediumDelay} ease-in-out;
    }

    @media (prefers-reduced-motion) {
        :host(${focusVisible}) {
            transition-duration: 0.01s;
        }
    }

    :host(:active) {
        background: none;
    }

    :host([disabled]) {
        cursor: default;
        color: ${bodyFontDisabledColor};
        background: none;
    }
`;
