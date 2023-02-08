import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    actionRgbPartialColor,
    bannerButtonFillSelectedColor,
    bannerButtonHeight,
    bannerCloseButtonIconSize,
    bannerCloseButtonSize,
    bannerColor,
    bannerErrorBackgroundColor,
    bannerFontSize,
    bannerIconColor,
    bannerIconMarginTop,
    bannerInfoBackgroundColor,
    bannerLinkActiveFontColor,
    bannerNeutralBackgroundColor,
    bannerStartEndWidth,
    bannerTextGapSize,
    bannerTextVerticalPadding,
    bannerWarningBackgroundColor,
    bodyFont,
    borderHoverColor,
    buttonLabelFontColor,
    controlHeight,
    fillSelectedColor,
    iconColor,
    iconSize,
    linkActiveFontColor,
    linkDisabledFontColor,
    linkFontColor
} from '../theme-provider/design-tokens';
import { MultivaluePropertyStyleSheetBehavior } from '../utilities/style/multivalue-property-stylesheet-behavior';
import { BannerSeverity } from './types';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
        font: ${bodyFont};
        font-size: ${bannerFontSize};
        align-items: top;
        overflow: hidden;
        background: ${bannerNeutralBackgroundColor};
        color: ${bannerColor};
        ${iconColor.cssCustomProperty}: ${bannerIconColor};
    }

    :host(:not([open])) {
        display: none;
    }

    .icon {
        width: ${bannerStartEndWidth};
        display: flex;
        justify-content: center;
        margin-top: ${bannerIconMarginTop};
        flex: 0 0 auto;
    }

    .text {
        display: inline;
        margin-top: ${bannerTextVerticalPadding};
        margin-bottom: ${bannerTextVerticalPadding};
    }

    ::slotted([slot='title']) {
        font-weight: bold;
        padding-right: ${bannerTextGapSize};
        white-space: nowrap;
    }

    .controls {
        margin-left: auto;
        display: flex;
        justify-content: center;
    }

    slot[name='action'] {
        display: flex;
        align-content: center;
    }

    ::slotted(nimble-anchor[slot='action']) {
        ${linkFontColor.cssCustomProperty}: ${bannerColor};
        ${linkDisabledFontColor.cssCustomProperty}: ${bannerColor};
        ${linkActiveFontColor.cssCustomProperty}: ${bannerLinkActiveFontColor};
        white-space: nowrap;
        margin-top: ${bannerTextVerticalPadding};
    }

    ::slotted(nimble-button[slot='action']) {
        height: 24px;
        ${buttonLabelFontColor.cssCustomProperty}: ${bannerColor};
        ${fillSelectedColor.cssCustomProperty}: ${bannerButtonFillSelectedColor};
        ${borderHoverColor.cssCustomProperty}: ${bannerColor};
        white-space: nowrap;
        margin-top: calc((${controlHeight} - ${bannerButtonHeight}) / 2);
    }

    ::slotted(nimble-button[slot='action'][appearance='outline']) {
        ${actionRgbPartialColor.cssCustomProperty}: ${bannerColor}
    }

    .close {
        width: ${bannerStartEndWidth};
        display: flex;
        justify-content: center;
        margin-top: ${bannerIconMarginTop};
    }

    .close nimble-button {
        height: ${bannerCloseButtonSize};
        width: ${bannerCloseButtonSize};
        ${iconSize.cssCustomProperty}: ${bannerCloseButtonIconSize};
        ${buttonLabelFontColor.cssCustomProperty}: ${bannerColor};
        ${borderHoverColor.cssCustomProperty}: transparent;
        ${fillSelectedColor.cssCustomProperty}: ${bannerButtonFillSelectedColor};
    }

    .close nimble-button:hover {
        background: ${bannerButtonFillSelectedColor};
    }
`.withBehaviors(
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.error,
        css`
            :host {
                background: ${bannerErrorBackgroundColor};
            }
        `
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.warning,
        css`
            :host {
                background: ${bannerWarningBackgroundColor};
            }
        `
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.info,
        css`
            :host {
                background: ${bannerInfoBackgroundColor};
            }

            .icon {
                ${iconSize.cssCustomProperty}: 18px;
            }
        `
    )
);
