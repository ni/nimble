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
    ${display('flex')}

    :host {
        font: ${bodyFont};
        outline: none;
        color: ${bodyFontColor};
        inline-size: auto;
        block-size: 100%;
        flex-direction: column;
        position: relative;
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
        ${
            /**
             * Min inline size to accommodate all the possible buttons in the toolbar and max inline size is referred from the visual design.
             */ ''
        }
        min-inline-size: 360px;
        max-inline-size: 720px;
    }

    .container {
        display: flex;
        flex-direction: column;
        block-size: inherit;
        position: relative;
        max-block-size: 100%;
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
    }

    .container::after {
        display: block;
        content: ' ';
        position: absolute;
        bottom: calc(-1 * ${borderWidth});
        inline-size: 0px;
        block-size: 0px;
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
        inline-size: 100%;
    }

    .editor {
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        block-size: calc(100% - 44px);
        overflow: auto;
    }

    .ProseMirror {
        ${
            /**
             * Min block size represents the one line space for the initial view and max block size is referred from the visual design.
             * However, max block size will be `fit-content` when the `fit-to-content` attribute is implemented.
             */ ''
        }
        min-block-size: 32px;
        max-block-size: 132px;
        block-size: 100%;
        border: ${borderWidth} solid transparent;
        border-radius: 0px;
        background-color: transparent;
        font: inherit;
        padding: 8px;
        box-sizing: border-box;
        position: relative;
        color: inherit;
        ${
            /**
             * Below are the styles from prosemirror-view as the Prosemirror excepts the "white-space" to be set. The recommendation is to load the style from the below package.
             * https://github.com/ProseMirror/prosemirror-view/blob/db2223a88b540a8f381fc2720198342e29a60566/style/prosemirror.css#L5C1-L12C2
             */ ''
        }
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
        block-size: 40px;
        overflow-y: auto;
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
