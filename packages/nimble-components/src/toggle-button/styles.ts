import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    borderHoverColor,
    borderWidth,
    fillSelectedColor,
    largeDelay,
    smallDelay
} from '../theme-provider/design-tokens';
import { styles as buttonStyles } from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}

    .control[aria-pressed='true'] {
        background-color: ${fillSelectedColor};
        border-color: ${fillSelectedColor};
        position: relative;
        transition: box-shadow ${smallDelay};
        transition: border-color ${smallDelay};
    }

    .control[aria-pressed='true']:hover {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        transition: box-shadow ${smallDelay};
    }

    .control[aria-pressed='true']${focusVisible} {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        transition: box-shadow ${smallDelay};
    }

    .control[aria-pressed='true']:active {
        box-shadow: none;
        outline: none;
        transition: outline ${smallDelay};
        transition: box-shadow ${smallDelay};
    }

    :host([disabled]) .control[aria-pressed='true'] {
        border-color: ${fillSelectedColor};
        background-color: ${fillSelectedColor};
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
        z-index: -1;
    }

    .control[aria-pressed='true']:hover::before {
        background-color: ${fillSelectedColor};
    }

    .control[aria-pressed='true']${focusVisible}::before {
        background-color: ${fillSelectedColor};
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -3px;
        transition: outline ${largeDelay};
        color: transparent;
        padding: 2px;
    }

    .control[aria-pressed='true']:active::before {
        outline: none;
        padding: ${borderWidth};
    }
`;
