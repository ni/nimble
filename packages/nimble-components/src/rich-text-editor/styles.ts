import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    smallDelay,
    standardPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${bodyFont};
        outline: none;
        color: ${bodyFontColor};
        width: auto;
        height: 100%;
        flex-direction: column;
        position: relative;
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
        --ni-private-footer-section-height: 40px;
        ${
            /** Minimum width is added to accommodate all the possible buttons in the toolbar and to support the mobile width. */ ''
        }
        min-width: 360px;
    }

    .container {
        display: flex;
        flex-direction: column;
        height: inherit;
        position: relative;
        max-height: 100%;
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
            var(--ni-private-hover-indicator-width) solid;
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

    .editor {
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        height: calc(100% - var(--ni-private-footer-section-height));
        overflow: auto;
    }

    .ProseMirror {
        ${
            /**
             * Min height represents the one line space for the initial view and max height is referred from the visual design.
             * However, max height will be `fit-content` when the `fit-to-content` attribute for the editor component is implemented.
             */ ''
        }
        min-height: 32px;
        max-height: 132px;
        height: 100%;
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        background-color: transparent;
        font: inherit;
        padding: 8px;
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

    .footer-section {
        display: flex;
        justify-content: space-between;
        border: ${borderWidth} solid transparent;
        border-top-color: rgba(${borderRgbPartialColor}, 0.1);
        height: var(--ni-private-footer-section-height);
        overflow: hidden;
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
`;
