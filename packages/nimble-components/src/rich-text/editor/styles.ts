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
    mediumPadding,
    standardPadding,
    linkFontColor
} from '../../theme-provider/design-tokens';
import { styles as errorStyles } from '../../patterns/error/styles';

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
        ${
            /** Initial height of rich text editor with one line space when the footer is visible. */ ''
        }
        height: 82px;
        --ni-private-rich-text-editor-footer-section-height: 40px;
        ${
            /** Minimum width is added to accommodate all the possible buttons in the toolbar and to support the mobile width. */ ''
        }
        min-width: 360px;
    }

    .container {
        box-sizing: border-box;
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

    :host([disabled]) .container {
        color: ${bodyDisabledFontColor};
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.1);
    }

    :host([error-visible]) .container {
        border-bottom-color: ${failColor};
    }

    :host(:hover) .container::after {
        width: calc(100% + 2 * ${borderWidth});
    }

    :host([disabled]:hover) .container::after {
        width: 0px;
    }

    :host([error-visible]) .container::after {
        border-bottom-color: ${failColor};
    }

    .editor-container {
        display: contents;
    }

    .editor {
        display: flex;
        flex-direction: column;
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        flex: 1;
        overflow: hidden;
    }

    :host([footer-hidden]) .editor {
        height: 100%;
    }

    .ProseMirror {
        overflow: auto;
        height: 100%;
        border: 0px;
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

    li > p {
        margin-block: 0;
    }

    ${
        /**
         * Styles provided by Tiptap are necessary to display the placeholder value when the editor is empty.
         * Tiptap doc reference: https://tiptap.dev/api/extensions/placeholder#additional-setup
         */ ''
    }
    .ProseMirror p.is-editor-empty:first-child::before {
        color: ${controlLabelFontColor};
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
        word-break: break-word;
    }

    :host([disabled]) .ProseMirror p.is-editor-empty:first-child::before {
        color: ${controlLabelDisabledFontColor};
    }

    ${
        /**
         * Custom anchor stylings can be removed once leveraging 'nimble-anchor' is supported.
         * See: https://github.com/ni/nimble/issues/1516
         */ ''
    }
    .ProseMirror a {
        color: ${linkFontColor};
        white-space: normal;
        ${
            /**
             * Setting 'pointer-events: none;' to restrict the user from opening a link using the right-click context menu: If the user manually edits
             * the link's text content, the 'href' attribute of the anchor tag will not be updated. If they attempt to open it using
             * the right-click context menu with 'Open in new tab/window,' it will still navigate to the link specified
             * in the 'href' attribute, which may create unnecessary confusion while trying to open the link.
             *
             * Using pointer-events: none to disable link interactions can be removed when hyperlink support is added.
             * see: https://github.com/ni/nimble/issues/1527
             */ ''
        }
        pointer-events: none;
    }

    :host([disabled]) .ProseMirror a {
        color: ${bodyDisabledFontColor};
        fill: currentcolor;
        cursor: default;
    }

    ${/** End of anchor styles */ ''}

    .footer-section {
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;
        border: ${borderWidth} solid transparent;
        border-top-color: rgba(${borderRgbPartialColor}, 0.1);
        height: var(--ni-private-rich-text-editor-footer-section-height);
        overflow: hidden;
    }

    :host([footer-hidden]) .footer-section {
        display: none;
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

    :host([error-visible]) .error-icon.scrollbar-width-calculated {
        display: inline-flex;
        position: absolute;
        top: ${mediumPadding};
        right: var(--ni-private-rich-text-editor-scrollbar-width);
    }
`;
