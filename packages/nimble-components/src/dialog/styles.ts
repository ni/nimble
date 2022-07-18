import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderWidth,
    popupBoxShadowColor,
    popupBorderColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    dialog {
        background-color: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        box-shadow: 0px 2px 3px ${popupBoxShadowColor};
    }
`;
