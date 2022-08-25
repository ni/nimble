import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { Black } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
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
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
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

    .dialog-contents {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: ${drawerWidth};
        height: 100%;
        background-color: ${applicationBackgroundColor};
    }

    @media (prefers-reduced-motion) {
        .dialog-contents {
            animation-duration: 1ms;
        }
    }

    @keyframes slideinleft {
        0% { transform: translate(-100%); }
        100% { transform: translate(0%); }
    }

    :host([location='left']) .dialog-contents {
        border-right: ${borderWidth} solid ${popupBoxShadowColor};
        box-shadow: 3px 0px 8px ${popupBoxShadowColor};
    }

    :host([location='left']) dialog.animating .dialog-contents {
        animation: slideinleft ${largeDelay} ease-in;
    }

    :host([location='left']) dialog.closing .dialog-contents {
        animation-direction: reverse;
    }

    @keyframes slideinright {
        0% { transform: translate(100%); }
        100% { transform: translate(0%); }
    }

    :host([location='right']) .dialog-contents {
        right: 0px;
        border-left: ${borderWidth} solid ${popupBoxShadowColor};
        box-shadow: -3px 0px 8px ${popupBoxShadowColor};
    }

    :host([location='right']) dialog.animating .dialog-contents {
        animation: slideinright ${largeDelay} ease-in;
    }

    :host([location='right']) dialog.closing .dialog-contents {
        animation-direction: reverse;
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
        ${
            /*
                Set overflow-x to hidden while the animation is in progress so that a scrollbar
                isn't visible while the drawer hasn't expanded to its full width.
            */ ''
        }
        overflow-x: hidden;
    }

    :host(.hidden) dialog {
        visibility: hidden;
    }

    dialog::backdrop {
        opacity:0;
        ${
            /*
                The largeDelay token cannot be used on the backdrop because it is not
                a descendant of the nimble-theme-provider
            */ ''
        }
        transition: opacity 0.25s ease-in;
    }

    dialog.visible::backdrop {
        opacity: 1;
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
                Local Theme Behaviors to style the backdrop because it is not a descendent of the theme provider. As a result,
                the backdrop cannot be styled using tokens directly.
            */
            themeBehavior(
                Theme.light,
                css`
                dialog::backdrop {
                    background: ${hexToRgbaCssColor(Black, 0.3)};
                }
            `
            ),
            themeBehavior(
                Theme.dark,
                css`
                dialog::backdrop {
                    background: ${hexToRgbaCssColor(Black, 0.6)};
                }
            `
            ),
            themeBehavior(
                Theme.color,
                css`
                dialog::backdrop {
                    background: ${hexToRgbaCssColor(Black, 0.6)};
                }
            `
            )
        );