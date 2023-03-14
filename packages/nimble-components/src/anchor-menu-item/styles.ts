import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    controlHeight,
    fillHoverColor,
    fillSelectedColor,
    iconSize
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        font: ${bodyFont};
    }

    :host(:focus-within:not(:active)) {
        outline: 2px solid ${borderHoverColor};
        outline-offset: -2px;
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
    }
    slot[name='start']::slotted(*) {
        fill: currentcolor;
        width: ${iconSize};
        height: ${iconSize};
    }
    :host(.indent-1) .start {
        grid-column: 1;
    }
    :host(.indent-1) .content {
        grid-column: 2;
    }
    [part='end'] {
        display: none;
    }
`;
