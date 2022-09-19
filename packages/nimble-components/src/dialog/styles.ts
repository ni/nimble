import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    applicationBackgroundColor,
    titlePlus2Font,
    standardPadding,
    actionRgbPartialColor,
    bodyFont,
    titlePlus2FontColor,
    bodyFontColor,
    dialogWidth
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

    dialog {
        background-color: ${applicationBackgroundColor};
        box-shadow: 0px 4px 8px #0000004D;
        padding: 0px;
        width: ${dialogWidth};
    }

    ::slotted(header) {
        font: ${titlePlus2Font};
        color: ${titlePlus2FontColor};
        min-height: 48px;
        padding: 24px 24px 0px 24px;
        flex: none;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    ::slotted(section) {
        font: ${bodyFont};
        color: ${bodyFontColor};
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: ${standardPadding};
    }

    ::slotted(footer) {
        padding: 24px;
        flex: none;
        display: flex;
        gap: ${standardPadding};
        justify-content: flex-end;
        border-top: 2px solid rgba(${actionRgbPartialColor}, 0.1);
    }
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
