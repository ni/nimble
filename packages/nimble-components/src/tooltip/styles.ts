import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    BannerFail100DarkUi,
    Black15,
    Black85,
    Black91,
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
        background-color: var(--ni-private-background-color);
        padding-bottom: 6px;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        padding-top: ${smallPadding};
    }

    nimble-icon-exclamation-mark {
        display: none;
        color: green;
        width: 14px;
        height: 14px;
        padding-right: 8px;
    }

    :host(.fail.icon-visible) nimble-icon-exclamation-mark {
        display: flex;
        flex: 0 0 auto;
    }

    nimble-icon-info {
        display: none;
        color: purple;
        width: 14px;
        height: 14px;
        padding-right: 8px;
    }

    :host(.information.icon-visible) nimble-icon-info {
        display: flex;
        flex: 0 0 auto;
    }

    :host(.fail) .tooltip {
        --ni-private-tooltip-border-color: ${BannerFail100DarkUi};
        --ni-private-tooltip-background-color: ${White};
    }

    :host(.information) .tooltip {
        --ni-private-tooltip-border-color: ${Information100LightUi};
        --ni-private-tooltip-background-color: ${White};
    }
`.withBehaviors(
    /* Local Theme Behaviors for tooltip borders and backgrounds */
        themeBehavior(
            css`
            ${'' /* Light Theme */}
        `,
            css`
            ${'' /* Dark Theme */}
            .tooltip {
                --ni-private-tooltip-border-color: ${hexToRgbaCssColor(
                Black15,
                0.3
            )};
                background-color: ${Black85};
            }
        `,
            css`
            ${'' /* Color Theme In progress fix icon colors */}
            .tooltip {
                --ni-private-tooltip-border-color: ${hexToRgbaCssColor(
                White,
                0.15
            )};
                background-color: ${hexToRgbaCssColor(White, 0.15)};
            }

            :host(.fail) .tooltip {
                --ni-private-tooltip-border-color: ${White};
            }

            :host(.information) .tooltip {
                --ni-private-tooltip-border-color: ${White};
            }

            :host nimble-icon-exclamation-mark {
                fill: solid ${hexToRgbaCssColor(White, 0.6)};
            }
        `
        )
    );
