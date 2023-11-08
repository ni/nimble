import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    mentionFont,
    mentionFontColor,
    mentionDisabledFontColor
} from '../../../../theme-provider/design-tokens';
import { iconAtTag } from '../../../../icons/at';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${mentionFont};
        white-space: normal;
        --ni-nimble-icon-color: ${mentionFontColor};
    }

    .control {
        color: ${mentionFontColor};
    }

    :host([disabled]) .control {
        color: ${mentionDisabledFontColor};
        --ni-nimble-icon-color: ${mentionDisabledFontColor};
    }

    ${iconAtTag} {
        position: relative;
        right: -1.6px;
        vertical-align: bottom;
    }

    :host([disable-editing]) slot {
        display: none;
    }
`;
