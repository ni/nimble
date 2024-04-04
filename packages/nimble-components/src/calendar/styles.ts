import { css } from '@microsoft/fast-element';
import {
    buttonAppearanceVariantStyles,
    styles as buttonStyles
} from '../patterns/button/styles';
import { fillHoverColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${buttonStyles}
    ${buttonAppearanceVariantStyles}

    :host::part(day) {
        background: ${fillHoverColor} !important;
    }
`;
