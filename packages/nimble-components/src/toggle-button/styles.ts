import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    borderHoverColor,
    borderWidth,
    fillSelectedColor,
    smallDelay
} from '../theme-provider/design-tokens';
import { styles as buttonStyles } from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}

    .control[aria-pressed='true'] {
        background-color: ${fillSelectedColor};
        border-color: ${fillSelectedColor};
        position: relative;
        transition: box-shadow ${smallDelay} ease-in-out,
            border-color ${smallDelay} ease-in-out,
            background-size ${smallDelay} ease-in-out;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .control[aria-pressed='true']:hover {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        background-image: linear-gradient(
            ${fillSelectedColor},
            ${fillSelectedColor}
        );
        background-size: calc(100% - 4px) calc(100% - 4px);
    }

    .control[aria-pressed='true']${focusVisible} {
        background-color: transparent;
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        background-image: linear-gradient(
            ${fillSelectedColor},
            ${fillSelectedColor}
        );
        background-size: calc(100% - 4px) calc(100% - 4px);
    }

    .control[aria-pressed='true']:active {
        box-shadow: none;
        outline: none;
        background-image: linear-gradient(
            ${fillSelectedColor},
            ${fillSelectedColor}
        );
        background-size: calc(100% - 2px) calc(100% - 2px);
    }

    :host([disabled]) .control[aria-pressed='true'] {
        border-color: ${fillSelectedColor};
        background-color: ${fillSelectedColor};
        background-image: none;
    }

    :host([disabled]) .control[aria-pressed='true']:hover {
        border-color: ${fillSelectedColor};
        background-color: ${fillSelectedColor};
        box-shadow: none;
        outline: none;
    }

    .control[aria-pressed='true']::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        box-sizing: border-box;
        outline: 0px solid transparent;
        outline: none;
        background-clip: content-box;
    }

    .control[aria-pressed='true']${focusVisible}::before {
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -3px;
        transition: outline ${smallDelay} ease-in-out;
        color: transparent;
    }

    .control[aria-pressed='true']:active::before {
        outline: none;
    }
`;
