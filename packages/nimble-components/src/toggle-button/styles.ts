import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import { fillSelectedColor } from '../theme-provider/design-tokens';
import { styles as buttonStyles } from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}

    .control[aria-pressed='true'] {
        background-color: ${fillSelectedColor};
        border-color: ${fillSelectedColor};
    }

    .control[aria-pressed='true']:hover {
        background-color: ${fillSelectedColor};
    }

    .control[aria-pressed='true']${focusVisible} {
        background-color: ${fillSelectedColor};
    }

    :host([disabled]) .control[aria-pressed='true'] {
        background-color: ${fillSelectedColor};
        border-color: ${fillSelectedColor};
    }

    :host([disabled]) .control[aria-pressed='true']:hover {
        background-color: ${fillSelectedColor};
        border-color: ${fillSelectedColor};
    }
`;
