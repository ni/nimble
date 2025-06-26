import { css } from '@ni/fast-element';
import { display } from '../../../utilities/style/display';
import {
    mentionFont,
    mentionFontColor,
    mentionDisabledFontColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        font: ${mentionFont};
    }

    .control {
        color: ${mentionFontColor};
    }

    :host([disabled]) .control {
        color: ${mentionDisabledFontColor};
    }
`;
