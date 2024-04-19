import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderColor,
    borderWidth
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        border: ${borderWidth} solid ${borderColor};
    }

    .slot {
        font: ${bodyFont};
        color: ${bodyFontColor};
    }
`;
