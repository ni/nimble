import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    linkFontColor,
    mentionFontColor
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
        --ni-nimble-private-mention-font-color: ${mentionFontColor};
    }

    .viewer {
        font: inherit;
        outline: none;
        box-sizing: border-box;
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

    nimble-anchor {
        font: unset;
    }

    ${
        /**
         * When an absolute link is not HTTPS/HTTP, the anchor tag renders without an `href`, appearing as plain text.
         * However, the `nimble-anchor` displays differently in color when the `href` attribute is absent.
         * To ensure a consistent appearance, the font color is forced to the default link color regardless of the `href`
         * attribute's presence.
         *
         * See models/markdown-parser.ts where link elements are emitted for more info.
         */ ''
    }
    nimble-anchor::part(control) {
        color: ${linkFontColor};
    }
`;
