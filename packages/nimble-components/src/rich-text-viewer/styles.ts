import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    bodyFontLineHeight,
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

    p,
    ol,
    ul,
    li {
        margin-block-start: 0px;
        margin-block-end: 0px;
        line-height: ${bodyFontLineHeight};
    }

    a {
        word-break: break-all;
        color: ${linkFontColor};
    }

    a:active {
        color: ${linkActiveFontColor};
    }

    :host([fit-to-content]) {
        block-size: auto;
    }

    .container {
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
`;
