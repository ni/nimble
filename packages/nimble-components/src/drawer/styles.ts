import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    borderWidth,
    contentFontSize,
    drawerHeaderFontFamily,
    drawerHeaderFontSize,
    fontFamily,
    labelFontColor,
    popupBorderColor,
    popupBoxShadowColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')} :host {
        position: relative;
        top: 0;
        bottom: 0;
        width: fit-content;
        height: 100%;
        outline: none;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${labelFontColor};
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

    .overlay {
        position: fixed;
        inset: 0px;
        background: ${popupBorderColor};
        touch-action: none;
    }

    .control {
        position: relative;
        top: 0px;
        bottom: 0px;
        width: fit-content;
        height: 100%;
        display: grid;
        grid-template-rows: max-content auto max-content;
        flex-direction: column;
        box-sizing: border-box;
        border-radius: 0px;
        border-width: 0px;
        width: var(--drawer-width);
        background-color: ${applicationBackgroundColor};
    }

    :host([modal]) .control {
        position: absolute;
        height: 100%;
    }

    :host(.hidden) .control {
        visibility: hidden;
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
        padding: var(--standard-padding);
        font-family: ${drawerHeaderFontFamily};
        font-size: ${drawerHeaderFontSize};
    }

    ::slotted(section) {
        padding: var(--standard-padding);
        grid-row: 2;
        overflow-y: auto;
    }

    ::slotted(footer) {
        padding: var(--standard-padding);
        display: flex;
        justify-content: flex-end;
        border-top: ${borderWidth} solid ${popupBorderColor};
    }
`;
