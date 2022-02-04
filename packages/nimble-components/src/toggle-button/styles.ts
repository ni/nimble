import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    borderColorHover,
    fillColorSelected
} from '../theme-provider/design-tokens';
import { buttonStyles } from '../styles/patterns/button';

export const styles = css`
    ${buttonStyles}

    :host {
        user-select: none;
    }

    .control[aria-pressed='true'],
    .control[disabled][aria-pressed='true'] {
        background-color: ${fillColorSelected};
        border-color: ${fillColorSelected};
    }

    .control[aria-pressed='true']:hover:not([disabled]) {
        background-color: ${fillColorSelected};
        border-color: ${borderColorHover};
    }

    .control${focusVisible}[aria-pressed='true'] {
        background-color: ${fillColorSelected};
    }

    .control:active[aria-pressed='true'] {
        background-color: ${fillColorSelected};
        border-color: ${fillColorSelected};
    }
`;
