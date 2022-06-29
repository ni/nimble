import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderRgbPartialColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    borderWidth,
    tooltipBackgroundColor,
    smallPadding,
    standardPadding,
    popupBoxShadowColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${tooltipCaptionFont};
        color: ${tooltipCaptionFontColor};
        text-align: left;
    }

    .tooltip {
        box-sizing: border-box;
        flex-shrink: 0;
        max-width: 440px;
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        box-shadow: 0px 3px 4px ${popupBoxShadowColor};
        background-color: ${tooltipBackgroundColor};
        padding-bottom: 6px;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        padding-top: ${smallPadding};
        display: inline-flex;
    }
`;
