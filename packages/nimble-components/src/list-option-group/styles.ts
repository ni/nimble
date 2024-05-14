import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        cursor: default;
        justify-content: left;
        flex-direction: column;
    }

    :host([visually-hidden]) {
        display: none;
    }

    .label-slot {
        display: none;
    }

    .header {
        font: ${groupHeaderFont};
        text-transform: ${groupHeaderTextTransform};
        color: ${groupHeaderFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
