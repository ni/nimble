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
    modalBackdropColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')}

    :host {
        position: relative;
        top: 0;
        bottom: 0;
        width: fit-content;
        height: 100%;
        outline: none;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    :host([modal]) {
        position: absolute;
    }

    :host([location='left']) {
        left: 0px;
    }

    :host([location='right']) {
        right: 0px;
    }

    .positioning-region {
        display: block;
        position: relative;
        justify-content: center;
        width: fit-content;
        height: 100%;
        inset: 0px;
        overflow: hidden;
        z-index: 999;
    }

    :host([modal]) .positioning-region {
        width: 100%;
        position: fixed;
        display: flex;
    }

    ${/* Note: overlay is only present in the DOM when modal=true */ ''}
    .overlay {
        position: fixed;
        inset: 0px;
        background: ${modalBackdropColor};
        touch-action: none;
    }

    .control {
        position: relative;
        top: 0px;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-radius: 0px;
        border-width: 0px;
        width: ${drawerWidth};
        height: 100%;
        background-color: ${applicationBackgroundColor};
    }

    :host([modal]) .control {
        position: absolute;
        height: 100%;
    }

    :host([location='left']) .control {
        left: 0px;
        border-right: ${borderWidth} solid ${popupBoxShadowColor};
    }

    :host([location='right']) .control {
        right: 0px;
        border-left: ${borderWidth} solid ${popupBoxShadowColor};
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
`;
