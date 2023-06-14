import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    applicationBackgroundColor,
    borderHoverColor,
    borderWidth,
    fillSelectedColor
} from '../theme-provider/design-tokens';
import { styles as buttonStyles } from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}

    .control[aria-pressed='true'] {
        background-color: ${fillSelectedColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${fillSelectedColor} inset;
    }

    .control[aria-pressed='true']:hover {
        background-color: ${fillSelectedColor};
        box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset,
            0px 0px 0px 3px ${applicationBackgroundColor} inset;
        outline: none;
    }

    .control[aria-pressed='true']${focusVisible} {
        background-color: ${fillSelectedColor};
    }

    .control:active[aria-pressed='true'] {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset,
            0px 0px 0px 2px ${applicationBackgroundColor} inset;
        outline: none;
    }

    :host([disabled]) .control[aria-pressed='true'] {
        background-color: ${fillSelectedColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${fillSelectedColor} inset;
    }

    :host([disabled]) .control[aria-pressed='true']:hover {
        background-color: ${fillSelectedColor};
        box-shadow: 0px 0px 0px ${borderWidth} ${fillSelectedColor} inset;
    }
`;
