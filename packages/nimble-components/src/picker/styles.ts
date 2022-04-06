import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import { bodyFont } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        font: ${bodyFont};
    }

    :host([readonly]) ::slotted(nimble-picker-list ::slotted(input)) {
        display: none;
    }
`;
