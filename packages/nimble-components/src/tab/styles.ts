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
        color: ${bodyFontColor};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    :host(:hover) {
        background-color: ${fillHoverColor};
    }

    :host(:focus) {
        outline: none;
    }

    :host(:focus:hover) {
        background-color: ${fillHoverSelectedColor};
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

    slot {
        display: block;
        padding: calc(${standardPadding} / 2) ${standardPadding}
            calc(${standardPadding} / 2 - ${borderWidth});
    }

    .focus-indicator {
        top: -2px;
        position: relative;
        width: 0px;
        height: 0px;
        border-bottom: ${borderHoverColor} 1px solid;
        transition: width ${mediumDelay} ease-in;
    }

    :host(${focusVisible}) .focus-indicator {
        width: 100%;
    }

    @media (prefers-reduced-motion) {
        .focus-indicator {
            transition-duration: 0.01s;
        }
    }

    .active-indicator {
        top: -3px;
        position: relative;
        width: 0px;
        height: 0px;
        margin-top: 2px;
        border-bottom: ${borderHoverColor} 2px solid;
        transition: width ${mediumDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        .active-indicator {
            transition-duration: 0.01s;
        }
    }

    :host(:focus) .active-indicator {
        width: 100%;
    }
`;
