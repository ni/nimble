import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    controlLabelFontColor
} from '../../theme-provider/design-tokens';

export const cellStyles = css`
    :host {
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    span {
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    span:focus {
        border: 2px solid green;
        padding: 2px;
    }

    .placeholder {
        color: ${controlLabelFontColor};
    }
`;
