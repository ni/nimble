import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderRgbPartialColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    borderWidth,
    tooltipBackgroundColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${tooltipCaptionFont};
        letter-spacing: 0px;
        color: ${tooltipCaptionFontColor};
        text-align: left;
        cursor: pointer;
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
    }
`;
