import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColorHover,
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
        padding-left: 4px;
    }

    .listitem {
        line-height: ${controlHeight};
    }

    .control {
        color: ${contentFontColor};
        cursor: default;
        border: ${borderWidth} solid transparent;
        padding: 4px 4px 0px 4px;
    }

    .control:link {
        cursor: pointer;
        text-decoration: none;
    }

    .control:hover {
        color: ${hyperlinkColor};
        text-decoration: underline;
    }

    .control:active {
        color: ${hyperlinkColorActive};
        text-decoration: underline;
    }

    .control:link:focus-within {
        outline-color: ${borderColorHover};
    }

    .start,
    .end {
        display: none;
    }

    .separator {
        padding-left: 2px;
        padding-right: 2px;
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
`;
