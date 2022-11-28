import { css } from '@microsoft/fast-element';
import {
    bodyDisabledFontColor,
} from '../theme-provider/design-tokens';
import {
    primaryButtonStyles,
    styles as buttonStyles
} from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}
    ${primaryButtonStyles}

    .control {
        text-decoration: none;
    }

    :host([disabled]) .control {
        --ni-private-link-font-color: ${bodyDisabledFontColor};
        pointer-events: none;
        cursor: default;
    }
`;
