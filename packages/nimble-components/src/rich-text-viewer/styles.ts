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
        padding: ${smallPadding};
        width: auto;
        overflow: auto;
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
`;
