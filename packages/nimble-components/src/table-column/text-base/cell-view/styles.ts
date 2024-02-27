import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    placeholderFont,
    placeholderFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    :host(.right-align) {
        margin-left: auto;
    }

    span {
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host(.placeholder) span {
        font: ${placeholderFont};
        color: ${placeholderFontColor};
    }
`;
