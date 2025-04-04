import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    standardPadding,
    titlePlus1Font,
    drawerWidth,
    largeDelay,
    actionRgbPartialColor,
    modalBackdropColor
} from '../theme-provider/design-tokens';

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

    dialog::backdrop {
        background: ${modalBackdropColor};
    }

    dialog.animating::backdrop {
        animation: ni-private-drawer-fade-in-keyframes ${largeDelay} ease-in;
    }

    dialog.closing::backdrop {
        animation-direction: reverse;
    }

    .dialog-contents {
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
        box-shadow: 3px 0px 8px #00000033;
    }

    :host([location='left']) dialog.animating .dialog-contents {
        animation: ni-private-drawer-slide-in-left-keyframes ${largeDelay}
            ease-in;
    }

    @keyframes ni-private-drawer-slide-in-right-keyframes {
        0% {
            ${
                /*
                    Why 95% instead of 100%? See the following Safari bug:
                    https://bugs.webkit.org/show_bug.cgi?id=279148
                */ ''
            }
            transform: translate(95%);
        }
        100% {
            transform: translate(0%);
        }
    }

    :host([location='right']) .dialog-contents {
        right: 0px;
        box-shadow: -3px 0px 8px #00000033;
    }

    :host([location='right']) dialog.animating .dialog-contents {
        animation: ni-private-drawer-slide-in-right-keyframes ${largeDelay}
            ease-in;
    }

    @media (prefers-reduced-motion) {
        :host([location='left']) dialog.animating .dialog-contents,
        :host([location='right']) dialog.animating .dialog-contents {
            animation: ni-private-drawer-fade-in-keyframes ${largeDelay} ease-in;
        }
    }

    :host([location='left']) dialog.closing .dialog-contents {
        animation-direction: reverse;
    }

    :host([location='right']) dialog.closing .dialog-contents {
        animation-direction: reverse;
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
`;
