import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderRgbPartialColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    borderWidth,
    tooltipBackgroundColor,
    tooltipCaptionFontSize
} from '../theme-provider/design-tokens';

// box shadow color may need to be fixed
// purple color needs to be fixed

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${tooltipCaptionFont};
        font-style: normal;
        font-weight: normal;
        letter-spacing: 0px;
        color: ${tooltipCaptionFontColor};
        font-size: ${tooltipCaptionFontSize};
        font-height: 14px;
        text-align: left;
    }

    .tooltip {
        box-sizing: border-box;
        flex-shrink: 0;
        max-width: 440px;
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        box-shadow: 0px 3px 4px #00000029;
        background-color: ${tooltipBackgroundColor};
        padding-bottom: 6px;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
`;
