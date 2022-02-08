import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    fillColorSelected
} from '../theme-provider/design-tokens';
import { buttonStyles } from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}

    .control[aria-pressed='true'] {
        background-color: ${fillColorSelected};
        border-color: ${fillColorSelected};
    }

    .control[aria-pressed='true']:hover {
        background-color: ${fillColorSelected};
    }

    .control[aria-pressed='true']${focusVisible} {
        background-color: ${fillColorSelected};
    }

    .control[aria-pressed='true'][disabled] {
        background-color: ${fillColorSelected};
        border-color: ${fillColorSelected};
    }

    .control[aria-pressed='true'][disabled]:hover {
        background-color: ${fillColorSelected};
        border-color: ${fillColorSelected};
    }
`;
