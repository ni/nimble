import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    BannerFail100DarkUi,
    Black75,
    Fail100LightUi,
    Information100DarkUi,
    Information100LightUi,
    Warning100DarkUi,
    Warning100LightUi,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';

import {
    actionRgbPartialColor,
    applicationBackgroundColor,
    bodyFont,
    borderHoverColor,
    buttonLabelFontColor,
    controlHeight,
    controlSlimHeight,
    fillSelectedColor,
    iconColor,
    iconSize,
    linkActiveFontColor,
    linkDisabledFontColor,
    linkFontColor,
    standardPadding
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        font-size: 12.8px;
        align-items: top;
        overflow: hidden;
        color: ${White};
        ${iconColor.cssCustomProperty}: ${hexToRgbaCssColor(White, 0.6)};
    }

    :host(:not([open])) {
        display: none;
    }

    .container {
        display: flex;
        width: 100%;
    }

    .icon {
        width: 48px;
        display: flex;
        justify-content: center;
        margin-top: 8px;
        flex: 0 0 auto;
    }

    .text {
        display: inline;
        margin-top: 7px;
        margin-bottom: 7px;
    }

    slot[name='title']::slotted(*) {
        font-weight: bold;
        padding-right: 8px;
        white-space: nowrap;
    }

    :host([title-hidden]) slot[name='title'] {
        ${
            /**
             * Hide content visually while keeping it screen reader-accessible.
             * Source: https://webaim.org/techniques/css/invisiblecontent/#techniques
             * See discussion here: https://github.com/microsoft/fast/issues/5740#issuecomment-1068195035
             */
            ''
        }
        display: inline-block;
        height: 1px;
        width: 1px;
        position: absolute;
        margin: -1px;
        clip: rect(1px, 1px, 1px, 1px);
        clip-path: inset(50%);
        overflow: hidden;
        padding: 0;
    }

    .controls {
        height: ${controlHeight};
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: flex-start;
    }

    slot[name='action'] {
        display: flex;
        align-content: center;
        margin-left: ${standardPadding};
        white-space: nowrap;
    }

    slot[name='action']::slotted(nimble-anchor) {
        ${linkFontColor.cssCustomProperty}: ${White};
        ${linkDisabledFontColor.cssCustomProperty}: ${White};
        ${linkActiveFontColor.cssCustomProperty}: ${hexToRgbaCssColor(
            White,
            0.6
        )};
        font-size: 12.8px;
    }

    slot[name='action']::slotted(nimble-button) {
        ${controlHeight.cssCustomProperty}: ${controlSlimHeight};
        ${buttonLabelFontColor.cssCustomProperty}: ${White};
        ${fillSelectedColor.cssCustomProperty}: ${hexToRgbaCssColor(
            White,
            0.2
        )};
        ${borderHoverColor.cssCustomProperty}: ${White};
    }

    slot[name='action']::slotted(nimble-button[appearance='outline']) {
        ${actionRgbPartialColor.cssCustomProperty}: ${White}
    }

    .dismiss {
        width: 48px;
        display: flex;
        justify-content: center;
    }

    .dismiss nimble-button {
        ${controlHeight.cssCustomProperty}: 16px;
        ${iconSize.cssCustomProperty}: 14px;
        ${buttonLabelFontColor.cssCustomProperty}: ${White};
        ${borderHoverColor.cssCustomProperty}: transparent;
        ${fillSelectedColor.cssCustomProperty}: ${hexToRgbaCssColor(
            White,
            0.2
        )};
    }

    .dismiss nimble-button:focus-within {
        outline: 2px solid ${White};
    }

    .dismiss nimble-button:hover {
        background: ${hexToRgbaCssColor(White, 0.2)};
    }
`.withBehaviors(
    themeBehavior(
        Theme.light,
        css`
            :host {
                background: ${Black75};
            }

            :host([severity='error']) {
                background: ${Fail100LightUi};
            }

            :host([severity='warning']) {
                background: ${Warning100LightUi};
            }

            :host([severity='information']) {
                background: ${Information100LightUi};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                background: ${Black75};
            }

            :host([severity='error']) {
                background: ${BannerFail100DarkUi};
            }

            :host([severity='warning']) {
                background: ${Warning100DarkUi};
            }

            :host([severity='information']) {
                background: ${Information100DarkUi};
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            :host {
                background: ${applicationBackgroundColor};
            }

            .container {
                background: ${hexToRgbaCssColor(White, 0.3)};
            }
        `
    )
);
