import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    smallPadding
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        gap: ${smallPadding};
        align-items: center;
    }

    .no-shrink {
        flex-shrink: 0;
    }

    span {
        flex-shrink: 1;
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
