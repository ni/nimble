import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { applicationBackgroundColor, borderWidth, contentFontSize, fontFamily, labelFontColor, popupBorderColor, popupBoxShadowColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')} :host {
        position: absolute;
        top: 0;
        bottom: 0;
        width: fit-content;
        height: 100%;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        outline: none;
        user-select: none;
        color: ${labelFontColor};
        --min-drawer-width: 300px;
    }

    :host([modal]) {
        position: static;
        width: auto;
        height: auto;
        top: auto;
        bottom: auto;
    }

    :host([location="left"]) {
        left: 0px;
    }

    :host([location="right"]) {
        right: 0px;
    }

    :host .positioning-region {
        display: block;
        position: relative;
        justify-content: center;
        width: fit-content;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        z-index: 999;
    }

    :host([modal]) .positioning-region {
        width: 100%;
        position: fixed;
        display: flex;
        inset: 0px;
    }
    
    :host([modal][location="left"]) .positioning-region {
        border-right: none;
    }

    :host([modal][location="right"]) .positioning-region {
        border-left: none;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${popupBorderColor};
        touch-action: none;
    }

    .control {
        position: relative;
        top: 0;
        bottom: 0;
        width: fit-content;
        height: 100vh;
        display: flex;
        flex-direction: column;
        z-index: 1;
        box-sizing: border-box;
        border-radius: 0px;
        border-width: 0px;
        min-width: var(--min-drawer-width);
        background-color: ${applicationBackgroundColor};
    }

    :host([modal]) .control {
        position: absolute;
        height: 100%;
    }

    :host(.hidden) .control {
        visibility: hidden;
    }

    :host([location="left"]) .control {
        left: 0px;
        border-right: ${borderWidth} solid ${popupBoxShadowColor};
    }

    :host([location="right"]) .control {
        right: 0px;
        border-left: ${borderWidth} solid ${popupBoxShadowColor};
    }
`;
