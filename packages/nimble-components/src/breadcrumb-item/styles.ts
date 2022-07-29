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
        padding-left: calc(4px - ${borderWidth});
    }

    .listitem {
        display: flex;
        align-items: center;
    }

    .control {
        color: var(--ni-private-breadcrumb-link-font-color);
        cursor: default;
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${borderWidth} solid transparent;
        padding-right: calc(4px - ${borderWidth});
    }

    .control:any-link {
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

    .control:any-link${focusVisible} {
        border: ${borderWidth} solid ${borderHoverColor};
        outline: 2px solid ${borderHoverColor};
        outline-offset: 1px;
    }

    .start,
    .end {
        display: flex;
        align-items: center;
    }

    .start {
        margin-inline-end: 4px;
    }

    slot[name='separator'] {
        display: flex;
        align-items: center;
    }

    slot[name='separator'] svg {
        width: ${iconSize};
        height: ${iconSize};
    }

    slot[name='separator'] path {
        fill: ${placeholderFontColor};
    }
`;
