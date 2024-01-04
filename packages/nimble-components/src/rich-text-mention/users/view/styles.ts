import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    mentionFont,
    mentionDisabledFontColor,
    bodyFontColor,
    bodyFont,
    bodyDisabledFontColor,
    mentionFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: pre-wrap;
    }

    .control {
        font: ${mentionFont};
        color: ${mentionFontColor};
        display: none;
    }

    :host([disable-editing]) .control {
        display: inline;
    }

    :host([disabled]) .control {
        color: ${mentionDisabledFontColor};
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
    }

    :host([disable-editing]) {
        font: ${mentionFont};
    }

    :host([disable-editing]) slot {
        display: none;
    }
`;
