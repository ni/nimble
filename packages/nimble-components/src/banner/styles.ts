import { css } from '@microsoft/fast-element';
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
import { display } from '../utilities/style/display';

import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    controlHeight,
    controlSlimHeight,
    standardPadding
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';
import { accessiblyHidden } from '../utilities/style/accessibly-hidden';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        font-size: 12.8px;
        align-items: top;
        overflow: hidden;
    }

    :host(:not([open])) {
        display: none;
    }

    .container {
        color: ${bodyFontColor};
        display: flex;
        width: 100%;
    }

    .icon {
        width: 48px;
        display: flex;
        justify-content: center;
        margin-top: 8px;
        flex: 0 0 auto;
        opacity: 0.6;
    }

    .text {
        display: inline;
        margin-top: 7px;
        margin-bottom: 7px;
    }

    slot[name='title'] {
        display: inline;
        font-weight: bold;
        padding-right: 8px;
        white-space: nowrap;
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
        align-self: center;
        ${controlHeight.cssCustomProperty}: ${controlSlimHeight};
    }

    slot[name='action'] {
        display: flex;
        align-content: center;
        margin-left: ${standardPadding};
        white-space: nowrap;
    }

    slot[name='action']::slotted(nimble-anchor) {
        font-size: 12.8px;
    }

    .dismiss {
        width: 48px;
        display: flex;
        justify-content: center;
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
