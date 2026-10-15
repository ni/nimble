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
import { display } from '../utilities/style/display';

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
    themeBehavior(
        Theme.light,
        css`
            :host([appearance='block']) {
                background: ${Black75};
            }

            :host([appearance='block'][severity='error']) {
                background: ${Fail100LightUi};
            }

            :host([appearance='block'][severity='warning']) {
                background: ${Warning100LightUi};
            }

            :host([appearance='block'][severity='information']) {
                background: ${Information100LightUi};
            }

            :host([appearance='outline']) {
                background: ${White};
                box-shadow: inset 0 0 0 ${borderWidth} ${Black80};
                --ni-private-banner-outline-button-border-color: ${hexToRgbaCssColor(
                    Black91,
                    0.75
                )};
            }

            :host([appearance='outline'][severity='error']) {
                box-shadow: inset 0 0 0 ${borderWidth} ${Fail100LightUi};
            }

            :host([appearance='outline'][severity='warning']) {
                box-shadow: inset 0 0 0 ${borderWidth}
                    ${WarningTypographyLightUi};
            }

            :host([appearance='outline'][severity='information']) {
                box-shadow: inset 0 0 0 ${borderWidth}
                    ${Information100LightUi};
            }

            :host([appearance='outline']) .container {
                color: ${Black91};
            }

            :host([appearance='outline']) .icon {
                ${iconColor.cssCustomProperty}: ${Black80};
            }

            :host([appearance='outline'][severity='error']) .icon {
                ${iconColor.cssCustomProperty}: ${Fail100LightUi};
            }

            :host([appearance='outline'][severity='warning']) .icon {
                ${iconColor.cssCustomProperty}: ${Warning100LightUi};
            }

            :host([appearance='outline'][severity='information']) .icon {
                ${iconColor.cssCustomProperty}: ${Information100LightUi};
            }

            :host([appearance='outline']) .controls {
                ${actionRgbPartialColor.cssCustomProperty}: 255, 255, 255;
                ${buttonLabelFontColor.cssCustomProperty}: ${Black91};
                ${borderRgbPartialColor.cssCustomProperty}: 22, 22, 23;
                ${borderHoverColor.cssCustomProperty}: var(
                    --ni-private-banner-outline-button-border-color
                );
            }

            :host([appearance='outline'])
                slot[name='action']::slotted(nimble-button[appearance='outline']) {
                box-shadow: inset 0 0 0 ${borderWidth}
                    var(--ni-private-banner-outline-button-border-color);
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host([appearance='block']) {
                background: ${Black75};
            }

            :host([appearance='block'][severity='error']) {
                background: ${BannerFail100DarkUi};
            }

            :host([appearance='block'][severity='warning']) {
                background: ${Warning100DarkUi};
            }

            :host([appearance='block'][severity='information']) {
                background: ${Information100DarkUi};
            }

            :host([appearance='outline']) {
                background: ${Black80};
                box-shadow: inset 0 0 0 ${borderWidth} ${Black50};
            }

            :host([appearance='outline'][severity='error']) {
                box-shadow: inset 0 0 0 ${borderWidth} ${Fail100DarkUi};
            }

            :host([appearance='outline'][severity='warning']) {
                box-shadow: inset 0 0 0 ${borderWidth} ${Warning100DarkUi};
            }

            :host([appearance='outline'][severity='information']) {
                box-shadow: inset 0 0 0 ${borderWidth}
                    ${Information100DarkUi};
            }

            :host([appearance='outline']) .container {
                color: ${Black15};
            }

            :host([appearance='outline']) .icon {
                ${iconColor.cssCustomProperty}: ${Black50};
            }

            :host([appearance='outline'][severity='error']) .icon {
                ${iconColor.cssCustomProperty}: ${Fail100DarkUi};
            }

            :host([appearance='outline'][severity='warning']) .icon {
                ${iconColor.cssCustomProperty}: ${Warning100DarkUi};
            }

            :host([appearance='outline'][severity='information']) .icon {
                ${iconColor.cssCustomProperty}: ${Information100DarkUi};
            }

            :host([appearance='outline']) .controls {
                ${actionRgbPartialColor.cssCustomProperty}: 174, 176, 179;
                ${buttonLabelFontColor.cssCustomProperty}: ${Black15};
                ${borderRgbPartialColor.cssCustomProperty}: 241, 241, 242;
            }

            :host([appearance='outline'][severity='error']) .controls {
                ${actionRgbPartialColor.cssCustomProperty}: 255, 70, 99;
            }

            :host([appearance='outline'][severity='warning']) .controls {
                ${actionRgbPartialColor.cssCustomProperty}: 255, 129, 38;
            }

            :host([appearance='outline'][severity='information']) .controls {
                ${actionRgbPartialColor.cssCustomProperty}: 164, 110, 255;
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            :host([appearance='block']) {
                background: ${applicationBackgroundColor};
            }

            :host([appearance='outline']) {
                background: ${hexToRgbaCssColor(
                    White,
                    0.07
                )};
                box-shadow: inset 0 0 0 ${borderWidth}
                    ${hexToRgbaCssColor(White, 0.6)};
            }

            :host([appearance='block']) .container {
                background: ${hexToRgbaCssColor(White, 0.3)};
            }

            :host([appearance='outline']) .container {
                color: ${White};
            }

            :host([appearance='outline']) .icon {
                ${iconColor.cssCustomProperty}: ${hexToRgbaCssColor(White, 0.6)};
            }

            :host([appearance='outline']) .controls {
                ${actionRgbPartialColor.cssCustomProperty}: 255, 255, 255;
                ${buttonLabelFontColor.cssCustomProperty}: ${White};
                ${borderRgbPartialColor.cssCustomProperty}: 255, 255, 255;
            }
        `
    )
);
