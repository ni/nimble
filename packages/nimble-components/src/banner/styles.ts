import { css } from '@ni/fast-element';
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
    smallPadding,
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
        overflow-wrap: anywhere;
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
