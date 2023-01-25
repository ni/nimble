import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { Black75, White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';

import {
    bodyFont,
    failColor,
    informationColor,
    warningColor
} from '../theme-provider/design-tokens';
import { MultivaluePropertyStyleSheetBehavior } from '../utilities/style/multivalue-property-stylesheet-behavior';
import { BannerActionButtonAppearance, BannerType } from './types';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
        font: ${bodyFont};
        font-size: 12.8px;
        align-items: top;
    }

    .icon {
        width: 48px;
        display: flex;
        justify-content: center;
        margin-top: 7px;
    }

    .text {
        display: inline;
        margin-top: 7px;
        margin-bottom: 7px;
    }

    .heading {
        font-weight: bold;
        padding-right: 8px;
        white-space: nowrap;
    }

    .controls {
        margin-left: auto;
        display: flex;
        justify-content: center;
    }

    .action {
        display: flex;
        align-content: center;
    }

    .action nimble-anchor {
        --ni-nimble-link-font-color: ${White};
        --ni-nimble-link-active-font-color: rgba(255, 255, 255, 0.6);
        white-space: nowrap;
        margin-top: 7px;
    }

    .action nimble-button {
        height: 24px;
        --ni-nimble-button-label-font-color: ${White};
        --ni-nimble-fill-selected-color: rgba(255, 255, 255, 0.1);
        --ni-nimble-border-hover-color: ${White};
        white-space: nowrap;
        margin-top: 4px;
    }

    .action nimble-button:active {
        background: rgba(255, 255, 255, 0.2);
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
        --ni-nimble-icon-size: 14px;
        --ni-nimble-icon-color: ${White};
        --ni-nimble-button-label-font-color: ${White};
        --ni-nimble-fill-selected-color: rgba(255, 255, 255, 0.1);

    }

    .close nimble-button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`.withBehaviors(
    new MultivaluePropertyStyleSheetBehavior(
        'type',
        BannerType.error,
        css`
            :host {
                background: ${failColor};
                color: ${White};
                --ni-nimble-icon-color: rgba(255, 255, 255, 0.6);
                --ni-nimble-border-hover-color: transparent;
            }
        `
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'type',
        BannerType.warning,
        css`
            :host {
                background: ${warningColor};
                color: ${White};
                --ni-nimble-icon-color: rgba(255, 255, 255, 0.6);
                --ni-nimble-border-hover-color: transparent;
            }
        `
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'type',
        BannerType.info,
        css`
            :host {
                background: ${informationColor};
                color: ${White};
                --ni-nimble-icon-color: rgba(255, 255, 255, 0.6);
                --ni-nimble-border-hover-color: transparent;
            }

            .icon {
                --ni-nimble-icon-size: 18px;
            }
        `
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'type',
        BannerType.default,
        css`
            :host {
                background: ${Black75};
                color: ${White};
                --ni-nimble-icon-color: rgba(255, 255, 255, 0.6);
                --ni-nimble-border-hover-color: transparent;
            }
        `
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'actionButtonAppearance',
        BannerActionButtonAppearance.outline,
        css`
            .action nimble-button {
                --ni-nimble-action-rgb-partial-color: ${White}
            }
        `
    )
);
