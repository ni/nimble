import { css } from '@ni/fast-element';
import {
    BannerFail100DarkUi,
    Black15,
    Black50,
    Black75,
    Black80,
    Black91,
    Fail100DarkUi,
    Fail100LightUi,
    Information100DarkUi,
    Information100LightUi,
    Warning100DarkUi,
    Warning100LightUi,
    WarningTypographyLightUi,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    actionRgbPartialColor,
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    buttonLabelFontColor,
    controlHeight,
    controlSlimHeight,
    iconColor,
    smallPadding,
    standardPadding
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';
import { accessiblyHidden } from '../utilities/style/accessibly-hidden';
import { appearanceBehavior } from '../utilities/style/appearance';
import { display } from '../utilities/style/display';
import { BannerAppearance } from './types';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        font-size: 12.8px;
        align-items: top;
        background: transparent;
        box-shadow: none;
        overflow: hidden;
        overflow-wrap: anywhere;
    }

    :host(:not([open])) {
        display: none;
    }

    .container {
        background: transparent;
        color: ${bodyFontColor};
        display: flex;
        width: 100%;
    }

    .icon {
        display: none;
        margin: 8px ${smallPadding} 0 ${standardPadding};
        flex: 0 0 auto;
        opacity: 0.6;
    }

    :host([severity='error']) .icon,
    :host([severity='warning']) .icon,
    :host([severity='information']) .icon {
        display: flex;
    }

    .text {
        display: inline;
        margin: 7px 0 7px ${standardPadding};
    }

    :host([severity='error']) .text,
    :host([severity='warning']) .text,
    :host([severity='information']) .text {
        margin-left: 0;
    }

    slot[name='title'] {
        display: inline;
        font-weight: bold;
        padding-right: 8px;
    }

    :host([title-hidden]) slot[name='title'] {
        ${accessiblyHidden}
    }

    .controls {
        height: ${controlHeight};
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: flex-start;
        margin-top: ${smallPadding};
        ${controlHeight.cssCustomProperty}: ${controlSlimHeight};
    }

    slot[name='action'] {
        display: flex;
        align-content: center;
        margin-left: ${standardPadding};
        white-space: nowrap;
    }

    :host([prevent-dismiss]) slot[name='action'] {
        margin-right: 12px;
    }

    slot[name='action']::slotted(nimble-anchor) {
        font-size: 12.8px;
    }

    .dismiss {
        margin: 0 12px 0 ${standardPadding};
    }

    :host([prevent-dismiss]) .dismiss {
        display: none;
    }
`.withBehaviors(
    appearanceBehavior(
        BannerAppearance.block,
        css`
            :host {
                background: var(--ni-private-banner-block-background-color);
            }

            .container {
                background: var(
                    --ni-private-banner-block-container-background-color
                );
            }
        `
    ),
    appearanceBehavior(
        BannerAppearance.outline,
        css`
            :host {
                background: var(
                    --ni-private-banner-outline-background-color
                );
                box-shadow: inset 0 0 0 ${borderWidth}
                    var(--ni-private-banner-outline-border-color);
            }

            .container {
                background: transparent;
                color: var(--ni-private-banner-outline-font-color);
            }

            .icon {
                ${iconColor.cssCustomProperty}: var(
                    --ni-private-banner-outline-icon-color
                );
            }

            .controls {
                ${actionRgbPartialColor.cssCustomProperty}: var(
                    --ni-private-banner-outline-action-rgb-partial-color
                );
                ${buttonLabelFontColor.cssCustomProperty}: var(
                    --ni-private-banner-outline-button-font-color
                );
                ${borderRgbPartialColor.cssCustomProperty}: var(
                    --ni-private-banner-outline-button-rgb-partial-color
                );
            }
        `
    ),
    themeBehavior(
        Theme.light,
        css`
            :host {
                --ni-private-banner-block-background-color: ${Black75};
                --ni-private-banner-block-container-background-color: transparent;
                --ni-private-banner-outline-background-color: ${White};
                --ni-private-banner-outline-border-color: ${Black80};
                --ni-private-banner-outline-font-color: ${Black91};
                --ni-private-banner-outline-icon-color: ${Black80};
                --ni-private-banner-outline-button-border-color: ${hexToRgbaCssColor(
                    Black91,
                    0.75
                )};
                --ni-private-banner-outline-action-rgb-partial-color: 255, 255, 255;
                --ni-private-banner-outline-button-font-color: ${Black91};
                --ni-private-banner-outline-button-rgb-partial-color: 22, 22, 23;
            }

            :host([appearance='outline']) .controls {
                ${borderHoverColor.cssCustomProperty}: var(
                    --ni-private-banner-outline-button-border-color
                );
            }

            :host([appearance='outline'])
                slot[name='action']::slotted(nimble-button[appearance='outline']) {
                box-shadow: inset 0 0 0 ${borderWidth}
                    var(--ni-private-banner-outline-button-border-color);
            }

            :host([severity='error']) {
                --ni-private-banner-block-background-color: ${Fail100LightUi};
                --ni-private-banner-outline-border-color: ${Fail100LightUi};
                --ni-private-banner-outline-icon-color: ${Fail100LightUi};
            }

            :host([severity='warning']) {
                --ni-private-banner-block-background-color: ${Warning100LightUi};
                --ni-private-banner-outline-border-color: ${WarningTypographyLightUi};
                --ni-private-banner-outline-icon-color: ${Warning100LightUi};
            }

            :host([severity='information']) {
                --ni-private-banner-block-background-color: ${Information100LightUi};
                --ni-private-banner-outline-border-color: ${Information100LightUi};
                --ni-private-banner-outline-icon-color: ${Information100LightUi};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                --ni-private-banner-block-background-color: ${Black75};
                --ni-private-banner-block-container-background-color: transparent;
                --ni-private-banner-outline-background-color: ${Black80};
                --ni-private-banner-outline-border-color: ${Black50};
                --ni-private-banner-outline-action-rgb-partial-color: 174, 176, 179;
                --ni-private-banner-outline-font-color: ${Black15};
                --ni-private-banner-outline-icon-color: ${Black50};
                --ni-private-banner-outline-button-font-color: ${Black15};
                --ni-private-banner-outline-button-rgb-partial-color: 241, 241, 242;
            }

            :host([severity='error']) {
                --ni-private-banner-block-background-color: ${BannerFail100DarkUi};
                --ni-private-banner-outline-border-color: ${Fail100DarkUi};
                --ni-private-banner-outline-action-rgb-partial-color: 255, 70, 99;
                --ni-private-banner-outline-icon-color: ${Fail100DarkUi};
            }

            :host([severity='warning']) {
                --ni-private-banner-block-background-color: ${Warning100DarkUi};
                --ni-private-banner-outline-border-color: ${Warning100DarkUi};
                --ni-private-banner-outline-action-rgb-partial-color: 255, 129, 38;
                --ni-private-banner-outline-icon-color: ${Warning100DarkUi};
            }

            :host([severity='information']) {
                --ni-private-banner-block-background-color: ${Information100DarkUi};
                --ni-private-banner-outline-border-color: ${Information100DarkUi};
                --ni-private-banner-outline-action-rgb-partial-color: 164, 110, 255;
                --ni-private-banner-outline-icon-color: ${Information100DarkUi};
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            :host {
                --ni-private-banner-block-background-color: ${applicationBackgroundColor};
                --ni-private-banner-block-container-background-color: ${hexToRgbaCssColor(
                    White,
                    0.3
                )};
                --ni-private-banner-outline-background-color: ${hexToRgbaCssColor(
                    White,
                    0.07
                )};
                --ni-private-banner-outline-border-color: ${hexToRgbaCssColor(
                    White,
                    0.6
                )};
                --ni-private-banner-outline-action-rgb-partial-color: 255, 255, 255;
                --ni-private-banner-outline-font-color: ${White};
                --ni-private-banner-outline-icon-color: ${hexToRgbaCssColor(
                    White,
                    0.6
                )};
                --ni-private-banner-outline-button-font-color: ${White};
                --ni-private-banner-outline-button-rgb-partial-color: 255, 255, 255;
            }
        `
    )
);
