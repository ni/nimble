import { css } from '@microsoft/fast-element';
import {
    primaryButtonStyles,
    styles as buttonStyles
} from '../patterns/button/styles';
import { buttonLabelDisabledFontColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${buttonStyles}
    ${primaryButtonStyles}

    .control {
        text-decoration: none;
    }

    :host(:not([href])) {
        color: ${buttonLabelDisabledFontColor};
        cursor: default;
    }

    :host([disabled]) .control {
        pointer-events: none;
        cursor: default;
    }
`;
