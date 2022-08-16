import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    BannerFail100DarkUi,
    Black15,
    Black85,
    Black91,
    ForestGreen,
    Information100DarkUi,
    Information100LightUi,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    popupBoxShadowColor,
    borderWidth,
    standardPadding,
    smallPadding
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${tooltipCaptionFont};
        color: ${tooltipCaptionFontColor};
        text-align: left;
        --ni-private-tooltip-border-color: ${hexToRgbaCssColor(Black91, 0.3)};
        --ni-private-tooltip-background-color: ${Black15};
    }

    .tooltip {
        box-sizing: border-box;
        flex-shrink: 0;
        max-width: 440px;
        box-shadow: 0px 3px 4px ${popupBoxShadowColor};
        display: inline-flex;
        border: ${borderWidth} solid var(--ni-private-tooltip-border-color);
        background-color: var(--ni-private-tooltip-background-color);
        padding-bottom: 6px;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        padding-top: ${smallPadding};
    }

    .status-icon {
        display: none;
        width: 14px;
        height: 14px;
        padding-right: 8px;
    }

    :host(.fail.icon-visible) .fail {
        display: flex;
        flex: 0 0 auto;
    }

    :host(.information.icon-visible) .information {
        display: flex;
        flex: 0 0 auto;
    }
`.withBehaviors(
        themeBehavior(
            Theme.light,
            css`
            :host(.fail) {
                --ni-private-tooltip-border-color: ${BannerFail100DarkUi};
                --ni-private-tooltip-background-color: ${White};
            }

            :host(.information) {
                --ni-private-tooltip-border-color: ${Information100LightUi};
                --ni-private-tooltip-background-color: ${White};
            }
        `
        ),
        themeBehavior(
            Theme.dark,
            css`
            :host {
                --ni-private-tooltip-border-color: ${hexToRgbaCssColor(
                Black15,
                0.3
            )};
                --ni-private-tooltip-background-color: ${Black85};
            }

            :host(.information) {
                --ni-private-tooltip-border-color: ${Information100DarkUi};
            }

            :host(.fail) {
                --ni-private-tooltip-border-color: ${BannerFail100DarkUi};
            }
        `
        ),
        themeBehavior(
            Theme.color,
            css`
            .anchored-region {
                background-color: ${ForestGreen};
            }

            :host {
                --ni-private-tooltip-border-color: ${hexToRgbaCssColor(
                White,
                0.3
            )};
                --ni-private-tooltip-background-color: ${hexToRgbaCssColor(
                White,
                0.15
            )};
            }

            :host(.fail) {
                --ni-private-tooltip-border-color: ${White};
            }

            :host(.information) {
                --ni-private-tooltip-border-color: ${White};
            }

            .status-icon {
                opacity: 0.6;
            }
        `
        )
    );
