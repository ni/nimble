import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    applicationBackgroundColor,
    borderHoverColor,
    fillSelectedColor
} from '../theme-provider/design-tokens';
import { styles as buttonStyles } from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}

    .control[aria-pressed='true'] {
        background-color: ${fillSelectedColor};
        border-color: ${fillSelectedColor};
    }

    .control[aria-pressed='true']:hover {
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px 1px ${borderHoverColor} inset,
            0px 0px 0px 2px ${applicationBackgroundColor} inset;
        outline: none;
    }

    .control[aria-pressed='true']${focusVisible} {
        background-color: ${fillSelectedColor};
        border-color: ${borderHoverColor};
        box-shadow: 0px 0px 0px 1px ${borderHoverColor} inset,
            0px 0px 0px 2px ${applicationBackgroundColor} inset,
            0px 0px 0px 3px ${borderHoverColor} inset;
    }

    .control:active[aria-pressed='true'] {
        box-shadow: 0px 0px 0px 1px ${applicationBackgroundColor} inset;
        outline: none;
    }

    :host([disabled]) .control[aria-pressed='true'] {
        border-color: ${fillSelectedColor};
        background-color: ${fillSelectedColor};
    }

    :host([disabled]) .control[aria-pressed='true']:hover {
        border-color: ${fillSelectedColor};
        background-color: ${fillSelectedColor};
    }
`;
