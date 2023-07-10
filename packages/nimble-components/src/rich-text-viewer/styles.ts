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
        width: auto;
        overflow: auto;
        height: 100%;
        min-height: 36px;
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
        height: auto;
    }

    .container {
        font: inherit;
        outline: none;
        box-sizing: border-box;
        position: relative;
        color: inherit;
        min-width: 100px;
        padding: ${smallPadding};
        margin-bottom: 10px;
        margin-right: 10px;
    }
`;
