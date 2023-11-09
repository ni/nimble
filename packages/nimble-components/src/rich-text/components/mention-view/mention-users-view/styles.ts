import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    mentionFont,
    mentionFontColor,
    mentionDisabledFontColor,
    bodyEmphasizedFontColor
} from '../../../../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font: ${mentionFont};
        color: ${bodyEmphasizedFontColor}
        white-space: normal;
        --ni-nimble-icon-color: ${mentionFontColor};
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
        --ni-nimble-icon-color: ${mentionDisabledFontColor};
    }

    :host([disable-editing]) slot {
        display: none;
    }
`;
