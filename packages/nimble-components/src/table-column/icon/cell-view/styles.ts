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

    * {
        flex-shrink: 0;
    }
`;
