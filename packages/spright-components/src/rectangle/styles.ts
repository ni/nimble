import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        border: 2px solid ${borderHoverColor};
    }

    :host(:hover) {
        border-width: 4px;
    }

    :host([disabled]) {
        border-color: rgba(${borderRgbPartialColor}, 0.2);
    }

    slot {
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    :host([disabled]) slot {
        color: ${bodyDisabledFontColor};
    }
`;
