import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderWidth,
    popupBorderColor,
    popupBoxShadowColor,
    standardPadding,
    titlePlus1Font,
    drawerWidth,
    largeDelay
} from '../theme-provider/design-tokens';
import {
    modalBackdropColorThemeColorStatic,
    modalBackdropColorThemeDarkStatic,
    modalBackdropColorThemeLightStatic,
    largeDelayStatic
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

    @keyframes ni-private-drawer-fade-in-keyframes {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    dialog.animating::backdrop {
        animation: ni-private-drawer-fade-in-keyframes ${largeDelayStatic}
            ease-in;
    }

    dialog.closing::backdrop {
        animation-direction: reverse;
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

    @keyframes ni-private-drawer-slide-in-left-keyframes {
        0% {
            transform: translate(-100%);
        }
        100% {
            transform: translate(0%);
        }
    }

    :host([location='left']) .dialog-contents {
        border-right: ${borderWidth} solid ${popupBoxShadowColor};
        box-shadow: 3px 0px 8px ${popupBoxShadowColor};
    }

    :host([location='left']) dialog.animating .dialog-contents {
        animation: ni-private-drawer-slide-in-left-keyframes ${largeDelay}
            ease-in;
    }

    :host([location='left']) dialog.closing .dialog-contents {
        animation-direction: reverse;
    }

    @keyframes ni-private-drawer-slide-in-right-keyframes {
        0% {
            transform: translate(100%);
        }
        100% {
            transform: translate(0%);
        }
    }

    :host([location='right']) .dialog-contents {
        right: 0px;
        border-left: ${borderWidth} solid ${popupBoxShadowColor};
        box-shadow: -3px 0px 8px ${popupBoxShadowColor};
    }

    :host([location='right']) dialog.animating .dialog-contents {
        animation: ni-private-drawer-slide-in-right-keyframes ${largeDelay}
            ease-in;
    }

    :host([location='right']) dialog.closing .dialog-contents {
        animation-direction: reverse;
    }

    @media (prefers-reduced-motion) {
        :host([location='left']) dialog.animating .dialog-contents,
        :host([location='right']) dialog.animating .dialog-contents {
            animation-duration: 1ms;
        }
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
        border-top: ${borderWidth} solid ${popupBorderColor};
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
