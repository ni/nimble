import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    iconSize,
    passColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        height: ${controlHeight};
        box-sizing: border-box;
        font: ${bodyFont};
        color: ${bodyFontColor};
        padding-left: 4px;
    }

    .listitem {
        line-height: ${controlHeight};
    }

    .control {
        color: ${bodyFontColor};
        cursor: default;
        border: ${borderWidth} solid transparent;
        padding: 4px 4px 0px 4px;
    }

    .control:link {
        cursor: pointer;
        text-decoration: none;
    }

    .control:hover {
        text-decoration: underline;
    }

    .control:active {
        color: ${passColor};
        text-decoration: underline;
    }

    .control:link:focus-within {
        outline-color: ${borderHoverColor};
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
        fill: ${bodyFontColor};
    }
`;
