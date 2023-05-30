import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    smallPadding
} from '../../../theme-provider/design-tokens';

export const styles = css`
    :host {
        width: 100%;
        display: inline-flex;
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        gap: ${smallPadding};
        align-items: center;
    }

    .wrapper {
        display: contents;
    }

    * {
        flex-shrink: 0;
    }

    span {
        flex-shrink: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
