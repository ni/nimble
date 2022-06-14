import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    borderWidth,
    popupBoxShadowColor
} from '../theme-provider/design-tokens';

// font should be source sans pro regular 11px
// shadow color???

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${tooltipCaptionFont}; 
        color: ${tooltipCaptionFontColor};
        align-items: left;
        cursor: pointer;
        outline: none;
        user-select: none;
    }

    .tooltip {
        box-sizing: border-box;
        flex-shrink: 0;
        border: ${borderWidth} solid ${borderColor};
        box-shadow: ${popupBoxShadowColor};
        background: #00000029;
        padding: 1px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
`;
