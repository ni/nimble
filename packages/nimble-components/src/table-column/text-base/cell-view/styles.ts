import { css } from '@microsoft/fast-element';
import { bodyFont, bodyFontColor } from '../../../theme-provider/design-tokens';

export const styles = css`
    span {
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host(.right-align) {
        margin-left: auto;
    }
`;
