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
    fillSelectedColor,
    iconColor,
    iconSize,
    linkActiveFontColor,
    linkDisabledFontColor,
    linkFontColor,
    slimControlHeight,
    standardPadding
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { MultivaluePropertyStyleSheetBehavior } from '../utilities/style/multivalue-property-stylesheet-behavior';
import { themeBehavior } from '../utilities/style/theme';
import { BannerSeverity } from './types';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
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

    ::slotted([slot='title']) {
        font-weight: bold;
        padding-right: 8px;
        white-space: nowrap;
    }

    .controls {
        margin-left: auto;
        display: flex;
        justify-content: center;
    }

    slot[name='action'] {
        display: flex;
        align-content: center;
    }

    ::slotted(nimble-anchor[slot='action']) {
        ${linkFontColor.cssCustomProperty}: ${White};
        ${linkDisabledFontColor.cssCustomProperty}: ${White};
        ${linkActiveFontColor.cssCustomProperty}: ${hexToRgbaCssColor(
            White,
            0.6
        )};
        font-size: 12.8px;
        white-space: nowrap;
        margin-top: 7px;
        margin-left: ${standardPadding};
    }

    ::slotted(nimble-button[slot='action']) {
        height: ${slimControlHeight};
        ${buttonLabelFontColor.cssCustomProperty}: ${White};
        ${fillSelectedColor.cssCustomProperty}: ${hexToRgbaCssColor(
            White,
            0.2
        )};
        ${borderHoverColor.cssCustomProperty}: ${White};
        font-size: 12.8px;
        white-space: nowrap;
        margin-top: calc((${controlHeight} - ${slimControlHeight}) / 2);
        margin-left: ${standardPadding};
    }

    ::slotted(nimble-button[slot='action'][appearance='outline']) {
        ${actionRgbPartialColor.cssCustomProperty}: ${White}
    }

    .dismiss {
        width: 48px;
        display: flex;
        justify-content: center;
        margin-top: 8px;
    }

    .dismiss nimble-button {
        height: 16px;
        width: 16px;
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
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            :host {
                background: ${Black75};
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
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.error,
        css``.withBehaviors(
            themeBehavior(
                Theme.light,
                css`
                    :host {
                        background: ${Fail100LightUi};
                    }
                `
            ),
            themeBehavior(
                Theme.dark,
                css`
                    :host {
                        background: ${BannerFail100DarkUi};
                    }
                `
            )
        )
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.warning,
        css``.withBehaviors(
            themeBehavior(
                Theme.light,
                css`
                    :host {
                        background: ${Warning100LightUi};
                    }
                `
            ),
            themeBehavior(
                Theme.dark,
                css`
                    :host {
                        background: ${Warning100DarkUi};
                    }
                `
            )
        )
    ),
    new MultivaluePropertyStyleSheetBehavior(
        'severity',
        BannerSeverity.info,
        css``.withBehaviors(
            themeBehavior(
                Theme.light,
                css`
                    :host {
                        background: ${Information100LightUi};
                    }
                `
            ),
            themeBehavior(
                Theme.dark,
                css`
                    :host {
                        background: ${Information100DarkUi};
                    }
                `
            )
        )
    )
);
