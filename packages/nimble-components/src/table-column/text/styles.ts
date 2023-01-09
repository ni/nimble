import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    controlLabelFontColor
} from '../../theme-provider/design-tokens';

export const cellStyles = css`
    .placeholder {
        font: ${bodyFont};
        color: ${controlLabelFontColor};
        white-space: nowrap;
    }

    .text-value {
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
    }
`;
