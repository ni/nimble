import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    iconSize,
    smallPadding
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        gap: ${smallPadding};
        align-items: center;
    }

    .reserve-icon-width {
        flex-shrink: 0;
        width: ${iconSize};
        height: ${iconSize};
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
