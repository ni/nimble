import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor, borderWidth, popupBorderColor, popupBoxShadowColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')} :host {
        --elevation: 11;
        background: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        margin: 0;
        padding: 4px;
        max-width: 368px;
        min-width: 64px;
        box-shadow: 0px 2px 3px ${popupBoxShadowColor};
    }
    :host([slot="submenu"]) {
        width: max-content;
    }
    ::slotted(hr) {
        box-sizing: content-box;
        height: 0;
        margin: 0;
        border: none;
        border-top: ${borderWidth} solid ${popupBorderColor};
    }
`;