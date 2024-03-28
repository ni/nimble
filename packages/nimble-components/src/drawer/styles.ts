import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    standardPadding,
    titlePlus1Font,
    drawerWidth,
    actionRgbPartialColor
} from '../theme-provider/design-tokens';
import {
    modalBackdropColorThemeColorStatic,
    modalBackdropColorThemeDarkStatic,
    modalBackdropColorThemeLightStatic
} from '../theme-provider/design-tokens-static';
import { Theme } from '../theme-provider/types';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('block')}

    :host {
        position: absolute;
        width: auto;
        height: 100%;
        outline: none;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    dialog {
        color: inherit;
        font: inherit;
        background-color: transparent;
        width: auto;
        top: 0px;
        bottom: 0px;
        border-radius: 0px;
        border-width: 0px;
        height: 100%;
        margin: 0px;
        padding: 0px;
        max-width: none;
        max-height: none;
        overflow: hidden;
    }

    .dialog-contents {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        position: absolute;
        width: ${drawerWidth};
        height: 100%;
        background-color: ${applicationBackgroundColor};
    }

    :host([location='left']) .dialog-contents {
        box-shadow: 3px 0px 8px #00000033;
    }

    :host([location='right']) .dialog-contents {
        right: 0px;
        box-shadow: -3px 0px 8px #00000033;
    }

    ${
        /*
            Styling for a 3-panel drawer with header, footer, and a content
            region filling the remaining space/height
        */ ''
    }

    ::slotted(header) {
        padding: ${standardPadding};
        flex: none;
        font: ${titlePlus1Font};
    }

    ::slotted(section) {
        padding: ${standardPadding};
        flex: auto;
        overflow-y: auto;
    }

    ::slotted(footer) {
        padding: ${standardPadding};
        flex: none;
        display: flex;
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
                background: ${modalBackdropColorThemeLightStatic};
            }
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeDarkStatic};
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            dialog::backdrop {
                background: ${modalBackdropColorThemeColorStatic};
            }
        `
    )
);
