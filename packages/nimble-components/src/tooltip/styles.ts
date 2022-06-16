import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    BannerFail100DarkUi,
    Black15,
    Information100LightUi,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    borderRgbPartialColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    borderWidth,
} from '../theme-provider/design-tokens';
import { TooltipStatus } from './types';

// box shadow color may need to be fixed
// purple color needs to be fixed

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
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        box-shadow: 0px 3px 4px #00000029; 
        background-color: ${Black15};
        padding: 1px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
`;
