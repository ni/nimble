import { css } from '@microsoft/fast-element';
import {
    buttonAppearanceVariantStyles,
    styles as buttonStyles
} from '../patterns/button/styles';
import { bodyFontColor, fillHoverColor, fillHoverSelectedColor, fillSelectedColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${buttonStyles}
    ${buttonAppearanceVariantStyles}

    :host {
        height: auto;
    }

    :host::part(previous) {
        background: transparent;
        border: none;
    }

    :host::part(next) {
        background: transparent;
        border: none;
    }

    ::part(day) {
        color: ${bodyFontColor};
    }

    ::part(day):hover {
        background: ${fillHoverColor};
    }

    ::part(selected) {
        background: ${fillSelectedColor};
    }

    ::part(selected):hover {
        background: ${fillHoverSelectedColor};
    }
`;
