import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    atMentionFont,
    atMentionFontColor
} from '../../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline')}

    :host {
        box-sizing: border-box;
        font: ${atMentionFont};
    }

    .control {
        color: ${atMentionFontColor};
        user-select: text;
    }
`;
