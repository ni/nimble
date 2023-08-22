import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    controlLabelFontColor,
    controlLabelDisabledFontColor,
    failColor,
    iconSize,
    smallDelay,
    standardPadding
} from '../theme-provider/design-tokens';
import { userSelectNone } from '../utilities/style/user-select';
import { styles as errorStyles } from '../patterns/error/styles';

export const styles = css`
    ${display('inline-flex')}
    ${errorStyles}

    :host {
        font: ${bodyFont};
        outline: none;
        color: ${bodyFontColor};
        flex-direction: column;
        --ni-private-rich-text-editor-hover-indicator-width: calc(
            ${borderWidth} + 1px
        );
        --ni-private-rich-text-editor-footer-section-height: 40px;
        --ni-private-rich-text-editor-tiptap-editor-minimum-height: 36px;
        ${
            /** Minimum width is added to accommodate all the possible buttons in the toolbar and to support the mobile width. */ ''
        }
        min-width: 360px;
    }

    :host([disabled]) *,
    :host([disabled]) {
        ${userSelectNone}
        color: ${bodyDisabledFontColor};
    }

    .container {
        display: flex;
        flex-direction: column;
        position: relative;
        height: 100%;
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
    }

    .container::after {
        display: block;
        content: ' ';
        position: absolute;
        bottom: calc(-1 * ${borderWidth});
        width: 0px;
        height: 0px;
        left: 50%;
        transform: translate(-50%, 50%);
        border-bottom: ${borderHoverColor}
            var(--ni-private-rich-text-editor-hover-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    .container:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    @media (prefers-reduced-motion) {
        .container::after {
            transition-duration: 0s;
        }
    }

    :host(:hover) .container::after {
        width: 100%;
    }

    :host([disabled]) .container,
    :host([disabled]) .container::after {
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.1);
    }

    :host([disabled]:hover) .container::after {
        width: 0px;
    }

    :host([error-visible]) .container {
        border-bottom-color: ${failColor};
    }

    :host([error-visible]) .container::after {
        border-bottom-color: ${failColor};
    }

    .editor {
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        height: calc(
            100% - var(--ni-private-rich-text-editor-footer-section-height)
        );
        overflow: auto;
    }

    .editor-container {
        display: contents;
    }

    .ProseMirror {
        ${
            /**
             * Min height represents the one line space for the initial view and max height is referred from the visual design.
             * However, max height will be `fit-content` when the `fit-to-content` attribute for the editor component is implemented.
             */ ''
        }
        min-height: var(--ni-private-rich-text-editor-tiptap-editor-minimum-height);
        max-height: 132px;
        height: 100%;
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        background-color: transparent;
        font: inherit;
        padding: 8px;
        ${
            /* This padding ensures that showing/hiding the error icon doesn't affect text layout */ ''
        }
        padding-right: calc(${iconSize});
        box-sizing: border-box;
        position: relative;
        color: inherit;
    }

    ${
        /**
         * Below are the styles from prosemirror-view as the Prose mirror expects the "white-space" to be set. The recommendation is to load the style from the below package.
         * However, the other classes used in the below file like ".ProseMirror-selectednode", ".ProseMirror-hideselection" were not used anywhere in the ".Prosemirror" content editable div in the DOM. So added only the necessary styles below.
         *
         * https://github.com/ProseMirror/prosemirror-view/blob/db2223a88b540a8f381fc2720198342e29a60566/style/prosemirror.css#L5C1-L12C2
         */ ''
    }
    .ProseMirror {
        word-wrap: break-word;
        white-space: pre-wrap;
        -webkit-font-variant-ligatures: none;
        font-variant-ligatures: none;
        font-feature-settings: 'liga' 0;
    }

    .ProseMirror pre {
        white-space: pre-wrap;
    }

    .ProseMirror li {
        position: relative;
    }

    ${/** End of Prose Mirror defined styles from prosemirror-view */ ''}

    .ProseMirror-focused {
        outline: none;
    }

    .ProseMirror > :first-child {
        margin-block-start: 0;
    }

    .ProseMirror > :last-child {
        margin-block-end: 0;
    }

    :host([fit-to-content]) .ProseMirror {
        max-height: fit-content;
    }

    li > p {
        margin-block: 0;
    }

    .ProseMirror p.is-editor-empty:first-child::before {
        color: ${controlLabelFontColor};
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
        word-break: break-all;
    }

    :host([disabled]) .ProseMirror p.is-editor-empty:first-child::before {
        color: ${controlLabelDisabledFontColor};
    }

    .footer-section {
        display: flex;
        justify-content: space-between;
        border: ${borderWidth} solid transparent;
        border-top-color: rgba(${borderRgbPartialColor}, 0.1);
        height: var(--ni-private-rich-text-editor-footer-section-height);
        overflow: hidden;
        visibility: visible;
    }

    :host([footer-hidden]) .footer-section {
        visibility: hidden;
        height: 0px;
    }

    :host([footer-hidden]) .ProseMirror {
        ${
            /**
             * Minimum height is the addition of existing minimum height of the tiptap editor div and the footer section height.
             * With this calculation, the editor will extend to use the footer height when it is hidden.
             *
             * Use case: If the footer is initially hidden and is dynamically enabled when the editor is focused, there will be no layout shift,
             * and the footer will smoothly appear within the editor.
             */ ''
        }
        min-height: calc(var(--ni-private-rich-text-editor-tiptap-editor-minimum-height) + var(--ni-private-rich-text-editor-footer-section-height));
    }

    nimble-toolbar::part(positioning-region) {
        background: transparent;
        padding-right: 8px;
    }

    nimble-toolbar::part(start) {
        gap: 8px;
    }

    .footer-actions {
        display: flex;
        justify-content: flex-end;
        margin-inline-end: ${standardPadding};
        gap: ${standardPadding};
        place-items: center;
    }

    :host([error-visible]) .error-icon {
        display: none;
    }

    :host([error-visible]) .error-icon[scrollbar-visible] {
        display: inline-flex;
        position: absolute;
        top: calc(${standardPadding} / 2);
        right: var(--ni-private-rich-text-editor-scrollbar-width);
    }
`;
