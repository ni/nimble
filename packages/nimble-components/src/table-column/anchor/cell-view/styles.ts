import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    controlLabelFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    :host {
        width: fit-content;
        max-width: 100%;
        height: fit-content;
        align-self: center;
    }

    nimble-anchor {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

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
