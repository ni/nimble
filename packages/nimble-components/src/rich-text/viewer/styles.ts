import { css } from '@microsoft/fast-element';
import { display } from '../../utilities/style/display';
import {
    bodyFont,
    bodyFontColor,
    linkFontColor
} from '../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        outline: none;
        color: ${bodyFontColor};
        width: auto;
        overflow: auto;
        height: 100%;
    }

    .viewer {
        font: inherit;
        outline: none;
        position: relative;
        color: inherit;
        overflow-wrap: anywhere;
    }

    .viewer > :first-child {
        margin-block-start: 0;
    }

    .viewer > :last-child {
        margin-block-end: 0;
    }

    li > p {
        margin-block: 0;
    }

    ${
        /* In Firefox, if the paragraph within the list is empty, the ordered lists overlap. Therefore, hiding the paragraph element allows for the proper rendering of empty lists.  */ ''
    }
    li > p:empty {
        display: none;
    }

    ${
        /**
         * In the rich-text editor, an absolute link renders as a native anchor, not a `nimble-anchor`. When such a link
         * is not HTTPS/HTTP, the anchor renders without an `href`, appearing as plain text.
         * However, in the rich-text viewer, absolute links are rendered as `nimble-anchor`s, and they do not look like
         * plain text when the `href` attribute is absent. They have a "disabled" color and may have an underline.
         * To ensure a consistent appearance between the editor and viewer, we force the font color to the default link/
         * plain text color regardless of the `href` attribute's presence. To remove the underline, the markdown parser
         * emits an `underline-hidden` attribute when the `href` attribute is absent.
         *
         * See models/markdown-parser.ts where link elements are emitted for more info.
         */ ''
    }
    nimble-anchor::part(control) {
        color: ${linkFontColor};
    }
`;
