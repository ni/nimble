import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    standardPadding,
    actionRgbPartialColor,
    bodyFont,
    bodyFontColor,
    titlePlus1Font,
    titlePlus1FontColor,
    smallPadding,
    subtitleFont,
    subtitleFontColor
} from '../theme-provider/design-tokens';
import {
    modalBackdropColorThemeColor,
    modalBackdropColorThemeDark,
    modalBackdropColorThemeLight
} from '../theme-provider/design-tokens-static';
import { Theme } from '../theme-provider/types';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('inline-flex')}

    dialog[open] {
        display: flex;
        flex-direction: column;
        background-color: ${applicationBackgroundColor};
        border: none;
        box-shadow: 0px 4px 8px #0000004D;
        padding: 0px;
        width: 400px;
        max-height: 600px;
    }

    header {
        min-height: 48px;
        padding: 24px 24px 0px 24px;
        flex: none;
        display: flex;
        flex-direction: column;
        gap: ${smallPadding};
    }

    :host([header-hidden]) header {
        display: none;
    }

    .title {
        display: flex;
        flex-direction: column;
        gap: ${smallPadding};
    }

    slot[name='title'] {
        font: ${titlePlus1Font};
        color: ${titlePlus1FontColor};
    }

    slot[name='title']::slotted(*) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    slot[name='subtitle'] {
        font: ${subtitleFont};
        color: ${subtitleFontColor};
    }

    section {
        flex: auto;
        overflow-y: auto;

        font: ${bodyFont};
        color: ${bodyFontColor};
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: ${standardPadding}
    }

    footer {
        padding: 24px;
        flex: none;
        display: flex;
        justify-content: flex-end;
        border-top: 2px solid rgba(${actionRgbPartialColor}, 0.1);
        gap: ${standardPadding};
    }

    footer.empty {
        padding: 0px;
        height: 72px;
        border-top: none;
    }

    :host([footer-hidden]) footer {
        display: none;
    }

    ${'' /*
    footer.empty {
        padding: 0px;
        height: 72px;
        border-top: none;
    }

    .footer-start-container {
        display: flex;
        gap: ${standardPadding};
    }

    .footer-middle-container {
        display: flex;
        gap: ${standardPadding};
        margin-left: auto;
    }

    .footer-end-container {
        display: flex;
        gap: ${standardPadding};
        margin-left: auto;
    } */}
`.withBehaviors(
    /*
     * We cannot use the modalBackdropColor token directly because the backdrop
     * element is not a descendant of the nimble-theme-provider element.
     */
        themeBehavior(
            Theme.light,
            css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeLight};
            }
        `
        ),
        themeBehavior(
            Theme.dark,
            css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeDark};
            }
        `
        ),
        themeBehavior(
            Theme.color,
            css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeColor};
            }
        `
        )
    );
