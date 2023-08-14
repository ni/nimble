import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    linkActiveFontColor,
    linkFontColor
} from '../theme-provider/design-tokens';

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
        box-sizing: border-box;
        position: relative;
        color: inherit;
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

    a {
        word-break: break-all;
        color: ${linkFontColor};
    }

    a:active {
        color: ${linkActiveFontColor};
    }
`;
