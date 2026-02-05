import { css } from '@ni/fast-element';
import {
    failColor,
    errorTextFont,
    errorTextFontLineHeight
} from '../../theme-provider/design-tokens';

export const styles = css`
    .severity-text {
        display: none;
    }

    :host([severity]) .severity-text {
        display: block;
        font: ${errorTextFont};
        color: ${failColor};
        width: 100%;
        position: absolute;
        bottom: calc(-1 * (${errorTextFontLineHeight} + 2px));
        left: 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :host([severity]) .severity-text:empty {
        display: none;
    }
`;
