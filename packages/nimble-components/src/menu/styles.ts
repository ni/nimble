import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    backgroundLevel1Color,
    borderWidth,
    borderColor,
    popupBorderColor,
    popupBoxShadowColor,
    groupHeader1Font,
    groupHeader1TextTransform,
    groupHeader1FontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        background: ${backgroundLevel1Color};
        border: ${borderWidth} solid ${popupBorderColor};
        margin: 0;
        padding: 4px;
        min-width: 168px;
        width: max-content;
        box-shadow: 0px 2px 3px ${popupBoxShadowColor};
    }
    ::slotted(*) {
        padding-left: 8px;
        padding-right: 8px;
    }
    ::slotted(hr) {
        box-sizing: content-box;
        height: 2px;
        margin: 4px;
        border: none;
        background: ${borderColor};
        opacity: 0.1;
    }
    ::slotted(header) {
        display: flex;
        font: ${groupHeader1Font};
        color: ${groupHeader1FontColor};
        text-transform: ${groupHeader1TextTransform};
        padding-top: 4px;
        padding-bottom: 4px;
    }
`;
