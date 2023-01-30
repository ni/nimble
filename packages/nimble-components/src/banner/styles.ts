import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { Black75, White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';

import {
    actionRgbPartialColor,
    bodyFont,
    borderHoverColor,
    buttonLabelFontColor,
    failColor,
    fillSelectedColor,
    iconColor,
    iconSize,
    informationColor,
    linkActiveFontColor,
    linkFontColor,
    warningColor
} from '../theme-provider/design-tokens';
import { MultivaluePropertyStyleSheetBehavior } from '../utilities/style/multivalue-property-stylesheet-behavior';
import { BannerSeverity } from './types';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
        font: ${bodyFont};
        font-size: 12.8px;
        align-items: top;
        overflow: hidden;
        background: ${Black75};
        color: ${White};
        ${iconColor.cssCustomProperty}: rgba(255, 255, 255, 0.6);
        ${borderHoverColor.cssCustomProperty}: transparent;
    }

    :host(:not([open])) {
        display: none;
    }

    .icon {
        width: 48px;
        display: flex;
        justify-content: center;
        margin-top: 7px;
        flex: 0 0 auto;
    }

    .text {
        display: inline;
        margin-top: 7px;
        margin-bottom: 7px;
    }

    ::slotted([slot="title"]) {
        font-weight: bold;
        padding-right: 8px;
        white-space: nowrap;
    }

    .controls {
        margin-left: auto;
        display: flex;
        justify-content: center;
    }

    slot[name="action"] {
        display: flex;
        align-content: center;
    }

    ::slotted(nimble-anchor[slot="action"]) {
        ${linkFontColor.cssCustomProperty}: ${White};
        ${linkActiveFontColor.cssCustomProperty}: rgba(255, 255, 255, 0.6);
        white-space: nowrap;
        margin-top: 7px;
    }

    ::slotted(nimble-button[slot="action"]) {
        height: 24px;
        ${buttonLabelFontColor.cssCustomProperty}: ${White};
        ${fillSelectedColor.cssCustomProperty}: rgba(255, 255, 255, 0.2);
        ${borderHoverColor.cssCustomProperty}: ${White};
        white-space: nowrap;
        margin-top: 4px;
    }

    ::slotted(nimble-button[slot="action"][appearance="outline"]) {
        ${actionRgbPartialColor.cssCustomProperty}: ${White}
    }

    .close {
        width: 48px;
        display: flex;
        justify-content: center;
        margin-top: 8px;
    }

    .close nimble-button {
        height: 16px;
        width: 16px;
        ${iconSize.cssCustomProperty}: 14px;
        ${iconColor.cssCustomProperty}: ${White};
        ${buttonLabelFontColor.cssCustomProperty}: ${White};
        ${fillSelectedColor.cssCustomProperty}: rgba(255, 255, 255, 0.1);

    }

    .close nimble-button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`.withBehaviors(
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.error,
        css`
            :host {
                background: ${failColor};
            }
        `
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.warning,
        css`
            :host {
                background: ${warningColor};
            }
        `
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.info,
        css`
            :host {
                background: ${informationColor};
            }

            .icon {
                ${iconSize.cssCustomProperty}: 18px;
            }
        `
    )
);
