import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    mentionFont,
    mentionFontColor,
    mentionDisabledFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${mentionFont};
    }

    .control {
        color: ${mentionFontColor};
    }

    :host([disabled]) .control {
        color: ${mentionDisabledFontColor};
    }
`;
