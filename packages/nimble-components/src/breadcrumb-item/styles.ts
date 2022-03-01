import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    iconSize,
    placeholderFontColor
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

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
        color: var(--ni-private-breadcrumb-link-font-color);
        cursor: default;
        border: ${borderWidth} solid transparent;
        padding: calc(4px - ${borderWidth});
    }

    .control:link {
        cursor: pointer;
        text-decoration: none;
    }

    .control:hover {
        text-decoration: underline;
    }

    .control:active {
        color: var(--ni-private-breadcrumb-link-active-font-color);
        text-decoration: underline;
    }

    .control:link${focusVisible} {
        border: ${borderWidth} solid ${borderHoverColor};
        outline: 2px solid ${borderHoverColor};
        outline-offset: 1px;
    }

    .start,
    .end {
        display: none;
    }

    slot[name='separator'] svg {
        position: relative;
        top: 4px;
        width: ${iconSize};
        height: ${iconSize};
    }

    slot[name='separator'] path {
        fill: ${placeholderFontColor};
    }
`;
