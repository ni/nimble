import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    borderWidth,
    popupBorderColor,
    elevation2BoxShadow,
    bodyFont,
    bodyFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        margin: 0;
        min-width: 176px;
        width: max-content;
        box-shadow: ${elevation2BoxShadow};
        color: ${bodyFontColor};
        font: ${bodyFont};
    }

    :host(:focus) {
        outline: 0px;
    }

    slot {
        padding: 4px;
        display: block;
    }
`;
