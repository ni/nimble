import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    mentionFont,
    mentionFontColor,
    mentionDisabledFontColor,
    bodyFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${mentionFont};
        color: ${bodyFontColor};
        white-space: normal;
    }

    .control {
        color: ${mentionFontColor};
        display: none;
    }

    :host([disable-editing]) .control {
        display: inline;
    }

    :host([disabled]) .control {
        color: ${mentionDisabledFontColor};
    }

    :host([disable-editing]) slot {
        display: none;
    }
`;
