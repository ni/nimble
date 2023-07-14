import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    linkActiveFontColor,
    linkFontColor,
    smallPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        outline: none;
        color: ${bodyFontColor};
        inline-size: auto;
        overflow: auto;
        block-size: 100%;
        min-block-size: 36px;
    }

    .viewer {
        font: inherit;
        outline: none;
        box-sizing: border-box;
        position: relative;
        color: inherit;
        min-inline-size: 100px;
        padding: ${smallPadding};
        margin-block-end: 10px;
        margin-inline-end: 10px;
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

    li > p:empty {
        display: contents;
    }

    a {
        word-break: break-all;
        color: ${linkFontColor};
    }

    a:active {
        color: ${linkActiveFontColor};
    }
`;
