import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderWidth,
    contentFontColor,
    contentFontSize,
    controlHeight,
    fontFamily,
    hyperlinkColor,
    hyperlinkColorActive,
    iconSize
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        height: ${controlHeight};
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${contentFontColor};
    }

    .listitem {
        padding-top: 4px;
        padding-bottom: 4px;
        line-height: 24px;
        padding-left: 6px;
        padding-right: 6px;
    }

    :host([href]) .listitem {
        padding-left: 0px;
        padding-right: 0px;
    }

    slot[name='separator'] svg {
        position: relative;
        top: 4px;
        width: ${iconSize};
        height: ${iconSize};
    }

    slot[name='separator'] path {
        fill: ${contentFontColor};
    }

    .control {
        color: ${contentFontColor};
        cursor: default;
        border: ${borderWidth} solid transparent;
        padding: 4px 6px 6px 6px;
    }

    .control:link {
        cursor: pointer;
        text-decoration: none;
    }

    .control:hover {
        color: ${hyperlinkColor};
    }

    .control:active {
        color: ${hyperlinkColorActive};
    }

    .control .content {
        position: relative;
    }

    .control .content::before {
        background: none;
    }

    .control:link .content::before {
        content: '';
        background: transparent;
        display: block;
        height: 1px;
        left: 0px;
        position: absolute;
        right: 0px;
        top: calc(1em + 4px);
        width: calc(100% - 2px);
    }

    .control[href]:hover .content::before {
        background: ${hyperlinkColor};
    }

    .control[href]:active .content::before {
        background: ${hyperlinkColorActive};
    }
`;
