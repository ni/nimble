import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    borderWidth,
    popupBorderColor,
    elevation2BoxShadow,
    bodyFont,
    bodyFontColor,
    smallPadding,
    menuMinWidth
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        flex-direction: column;
        margin: 0;
        min-width: ${menuMinWidth};
        box-shadow: ${elevation2BoxShadow};
        color: ${bodyFontColor};
        font: ${bodyFont};
    }

    :host(:focus) {
        outline: 0px;
    }

    slot {
        padding: ${smallPadding};
        display: block;
    }
`;
