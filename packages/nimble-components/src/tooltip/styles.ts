import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderRgbPartialColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    borderWidth,
    tooltipBackgroundColor,
} from '../theme-provider/design-tokens';

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
        max-width: 440px;
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        box-shadow: 0px 3px 4px #00000029; 
        background-color: ${tooltipBackgroundColor};
        padding: 1px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

    }
`;
