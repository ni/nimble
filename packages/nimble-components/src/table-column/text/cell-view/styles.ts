import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    controlLabelFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    span {
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .placeholder {
        color: ${controlLabelFontColor};
    }
`;
