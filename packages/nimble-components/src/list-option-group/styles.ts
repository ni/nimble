import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    groupHeaderFont
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${groupHeaderFont};
        cursor: pointer;
        justify-content: left;
        flex-direction: column;
    }

    .content {
        padding: 2px 4px;
    }
`;
