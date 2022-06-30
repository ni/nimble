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
    smallPadding,
    iconColor
} from '../theme-provider/design-tokens';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

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
        box-shadow: 0px 3px 4px ${popupBoxShadowColor};
        display: inline-flex;
    }

    :host(.defaultState) .tooltip {
        padding-bottom: 6px;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        padding-top: ${smallPadding};
    }

    :host(.errorState) .tooltip {
        padding-bottom: 6px;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        padding-top: ${smallPadding};
    }

    :host(.errorIconState) .tooltip {
        padding-bottom: 6px;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        padding-top: ${smallPadding};
    }

    :host(.infoState) .tooltip {
        padding-bottom: 6px;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        padding-top: ${smallPadding};
    }

    :host(.infoIconState) .tooltip {
        padding-bottom: 6px;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        padding-top: ${smallPadding};
    }

    
    
    
`.withBehaviors(
    /* Local Theme Behaviors for tooltip borders and backgrounds */
        themeBehavior(
            css`
            ${'' /* Light Theme */}
            :host(.defaultState) .tooltip {
                border: ${borderWidth} solid ${hexToRgbaCssColor(Black91, 0.3)};
                background-color: ${Black15};
            }

            :host(.errorState) .tooltip {
                border: ${borderWidth} solid ${BannerFail100DarkUi};
                background-color: ${White};
            }

            :host(.errorIconState) .tooltip {
                border: ${borderWidth} solid ${BannerFail100DarkUi};
                background-color: ${White};
            }

            :host(.infoState) .tooltip {
                border: ${borderWidth} solid ${Information100LightUi};
                background-color: ${White};
            }

            :host(.infoIconState) .tooltip {
                border: ${borderWidth} solid ${Information100LightUi};
                background-color: ${White};
            }

            :host(.tooltipError) {
                ${iconColor.cssCustomProperty}: ${BannerFail100DarkUi};
                width: 14px;
                height: 14px;
                padding-right: 8px;
            }

            :host(.tooltipInfo) {
                ${iconColor.cssCustomProperty}: ${Information100LightUi};
                width: 14px;
                height: 14px;
                padding-right: 8px;
            }
        `,
            css`
            ${'' /* Dark Theme */}
            :host(.defaultState) .tooltip {
                border: ${borderWidth} solid ${hexToRgbaCssColor(Black15, 0.3)};
                background-color: ${Black85};
            }

            :host(.errorState) .tooltip {
                border: ${borderWidth} solid ${BannerFail100DarkUi};
                background-color: ${Black85};
            }

            :host(.errorIconState) .tooltip {
                border: ${borderWidth} solid ${BannerFail100DarkUi};
                background-color: ${Black85};
            }

            :host(.infoState) .tooltip {
                border: ${borderWidth} solid ${Information100LightUi};
                background-color: ${Black85};
            }

            :host(.infoIconState) .tooltip {
                border: ${borderWidth} solid ${Information100LightUi};
                background-color: ${Black85};
            }
        `,
            css`
            ${'' /* Color Theme */}
            :host(.defaultState) .tooltip {
                border: ${borderWidth} solid ${hexToRgbaCssColor(White, 0.3)};
                background-color: ${hexToRgbaCssColor(White, 0.15)};
            }

            :host(.errorState) .tooltip {
                border: ${borderWidth} solid ${White};
                background-color: ${hexToRgbaCssColor(White, 0.15)};
            }

            :host(.errorIconState) .tooltip {
                border: ${borderWidth} solid ${White};
                background-color: ${hexToRgbaCssColor(White, 0.15)};
            }

            :host(.infoState) .tooltip {
                border: ${borderWidth} solid ${White};
                background-color: ${hexToRgbaCssColor(White, 0.15)};
            }

            :host(.infoIconState) .tooltip {
                border: ${borderWidth} solid ${White};
                background-color: ${hexToRgbaCssColor(White, 0.15)};
            }
        `
        )
    );
