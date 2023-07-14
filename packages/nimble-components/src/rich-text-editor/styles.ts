import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyFont, bodyFontColor, borderHoverColor, borderRgbPartialColor, borderWidth, linkActiveFontColor, linkFontColor, smallPadding } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        outline: none;
        color: ${bodyFontColor};
        inline-size: auto;
        block-size: 100%;
        flex-direction: column;
    }

    .container {
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        border-bottom-color: ${borderHoverColor};
    }

    .container:focus-within {
        border: ${borderWidth} solid ${borderHoverColor};
    }

    .editor {
        border: ${borderWidth} solid transparent;
        border-bottom-color: rgba(${borderRgbPartialColor}, 0.1);
        border-radius: 0px;
        min-inline-size: 350px;
    }
    
    .ProseMirror {
        min-block-size: 45px;
        block-size: 100%;
        overflow: auto;
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        background-color: transparent;
        font: inherit;
        padding: ${smallPadding};
        box-sizing: border-box;
        position: relative;
        color: inherit;
    }

    .ProseMirror-focused {
        outline: none;
    }

    .ProseMirror > :first-child {
        margin-block-start: 0;
    }

    .ProseMirror > :last-child {
        margin-block-end: 0;
    }

    li > p {
        margin-block: 0;
    }

    .editor a {
        word-break: break-all;
        color: ${linkFontColor};
    }

    .editor a:active {
        color: ${linkActiveFontColor};
    }

    .footer-section {
        display: flex; 
        justify-content: space-between;
        border: 0px;
        min-inline-size: 350px;
    }

    nimble-toolbar::part(positioning-region) {
        background: transparent;
    }

    nimble-toolbar::part(start) {
        gap: 0px;
    }

    :host:focus-within {
        border: ${borderWidth} solid ${borderHoverColor};
    }
`;
