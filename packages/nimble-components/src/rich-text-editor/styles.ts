import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyFont, bodyFontColor, borderHoverColor, borderRgbPartialColor, borderWidth, controlLabelFontColor, linkActiveFontColor, linkFontColor, smallDelay, smallPadding, standardPadding } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        outline: none;
        color: ${bodyFontColor};
        inline-size: auto;
        block-size: 100%;
        flex-direction: column;
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
        --ni-private-footer-visibility: hidden;
    }

    .container {
        display: flex;
        flex-direction: column;
        height: inherit;
        position: relative;
        max-block-size: 100%;
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
        border-bottom-color: ${borderHoverColor};
        min-inline-size: 350px;
    }

    .container::after {
        content: ' ';
        position: absolute;
        bottom: calc(-1 * ${borderWidth});
        inline-size: 0px;
        block-size: 0px;
        border-bottom: ${borderHoverColor}
            var(--ni-private-hover-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        .container::after {
            transition-duration: 0s;
        }
    }

    :host(:hover) .container::after {
        inline-size: 100%;
    }

    .editor {
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        block-size: calc(100% - 42px);
        overflow: auto;
    }
    
    .ProseMirror {
        min-block-size: 45px;
        block-size: 100%;
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        background-color: transparent;
        font: inherit;
        padding: 8px;
        padding-block-end: ${smallPadding};
        box-sizing: border-box;
        position: relative;
        color: inherit;

        ${
            /**
             * Below are the styles from prosemirror-view.
             */ ''
        }
        word-wrap: break-word;
        white-space: pre-wrap;
        white-space: break-spaces;
        -webkit-font-variant-ligatures: none;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0;
    }

    .ProseMirror pre {
        white-space: pre-wrap;
    }
    
    .ProseMirror li {
        position: relative;
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
        border: ${borderWidth} solid transparent;
        border-top-color: rgba(${borderRgbPartialColor}, 0.1);
        block-size: 40px;
        overflow-y: auto;
        visibility: var(--ni-private-footer-visibility);
    }

    nimble-toolbar::part(positioning-region) {
        background: transparent;
    }

    nimble-toolbar::part(start) {
        gap: 8px;
    }

    .footer-actions {
        display: flex;
        margin-inline-end: ${standardPadding};
        justify-content: flex-end;
        gap: 16px;
        place-items: center;
    }

    .ProseMirror p.is-editor-empty:first-child::before {
        color: ${controlLabelFontColor};
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }
`;
