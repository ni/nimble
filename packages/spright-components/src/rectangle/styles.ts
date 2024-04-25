import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        border: 2px solid ${borderHoverColor};
    }

    slot {
        font: ${bodyFont};
        color: ${bodyFontColor};
    }
`;
