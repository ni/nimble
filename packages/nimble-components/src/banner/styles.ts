import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { Black22, Black50, Black75, White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';

import {
    bodyFont,
    controlHeight,
    failColor,
    informationColor,
    warningColor
} from '../theme-provider/design-tokens';
import { MultivaluePropertyStyleSheetBehavior } from '../utilities/style/multivalue-property-stylesheet-behavior';
import { BannerType } from './types';

export const styles = css`
    ${display('flex')}

    :host {
        height: ${controlHeight};
        width: 100%;
        font: ${bodyFont};
        font-size: 12.8px;
        align-items: center;
    }

    .icon {
        display: flex;
        align-content: center;
        --ni-nimble-icon-size: 14px;
        padding-left: 16px;
        padding-right: 16px;
    }

    .text {
        display: flex;
    }

    .heading {
        font-weight: bold;
        padding-right: 8px;
    }

    .close {
        display: flex;
        margin-left: auto;
        padding-left: 16px;
        padding-right: 16px;
    }

    .close nimble-button {
        height: 16px;
        width: 16px;
        --ni-nimble-icon-size: 14px;
        --ni-nimble-icon-color: ${White};
        --ni-nimble-button-label-font-color: ${White};

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

            .icon {
                padding-right: 30px;
            }
        `
    )
);
