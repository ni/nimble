import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';

import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    controlHeight,
    fillHoverColor,
    fillSelectedColor,
    iconColor,
    iconSize
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('grid')}

    :host {
        font: ${bodyFont};
    }

    :host(:hover) {
        background: ${fillHoverColor};
    }

    :host(:active) {
        background: ${fillSelectedColor};
    }

    :host([disabled]) {
        background: transparent;
    }

    a {
        display: grid;
        contain: layout;
        overflow: visible;
        box-sizing: border-box;
        height: ${controlHeight};
        grid-template-columns: 1fr;
        column-gap: 8px;
        grid-template-rows: 1fr;
        justify-items: start;
        align-items: center;
        margin: 0 0;
        white-space: nowrap;
        color: ${bodyFontColor};
        fill: currentcolor;
        cursor: pointer;
        text-decoration: none;
        outline: none;
        padding-left: 8px;
        padding-right: 8px;
    }

    a${focusVisible} {
        outline: 2px solid ${borderHoverColor};
        outline-offset: -2px;
    }

    :host([disabled]) a {
        color: ${bodyDisabledFontColor};
        fill: currentcolor;
        cursor: default;
    }

    :host(.indent-1) a {
        grid-template-columns: ${iconSize} 1fr;
    }

    [part='start'] {
        display: contents;
        pointer-events: none;
    }

    slot[name='start']::slotted(*) {
        ${iconColor.cssCustomProperty}: currentcolor;
        width: ${iconSize};
        height: ${iconSize};
    }

    :host(.indent-1) [part='start'] {
        grid-column: 1;
    }

    .content {
        pointer-events: none;
    }

    :host(.indent-1) .content {
        grid-column: 2;
    }

    [part='end'] {
        display: none;
    }
`;
