import { css } from '@microsoft/fast-element';
import {
    buttonAppearanceVariantStyles,
    styles as buttonStyles
} from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}
    ${buttonAppearanceVariantStyles}

    .control {
        text-decoration: none;
    }

    [part='start'] {
        pointer-events: none;
    }

    .content {
        pointer-events: none;
    }

    [part='end'] {
        pointer-events: none;
    }
`;
