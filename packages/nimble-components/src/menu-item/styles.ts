import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';

import {
    controlHeight,
    fillSelectedColor,
    fillHoverColor,
    bodyFontColor,
    borderHoverColor,
    iconSize,
    bodyFont,
    bodyDisabledFontColor,
    iconColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        contain: layout;
        overflow: visible;
        box-sizing: border-box;
        height: ${controlHeight};
        grid-template-columns: 1fr;
        column-gap: 8px;
        grid-template-rows: 1fr;
        justify-items: start;
        align-items: center;
        padding-left: 8px;
        padding-right: 8px;
        margin: 0 0;
        white-space: nowrap;
        color: ${bodyFontColor};
        fill: currentcolor;
        cursor: pointer;
        font: ${bodyFont};
    }
    :host(${focusVisible}) {
        outline: 2px solid ${borderHoverColor};
        outline-offset: -2px;
    }
    :host([expanded]) {
        background: ${fillHoverColor};
    }
    :host(:hover) {
        background: ${fillHoverColor};
    }
    :host(:active:not([expanded])) {
        background: ${fillSelectedColor};
    }
    :host([disabled]) {
        color: ${bodyDisabledFontColor};
        fill: currentcolor;
        cursor: default;
    }
    :host([disabled]:hover) {
        background: transparent;
    }
    :host(.indent-0[aria-haspopup='menu']) {
        grid-template-columns: 1fr ${iconSize};
    }
    :host(.indent-1) {
        grid-template-columns: ${iconSize} 1fr;
    }
    :host(.indent-1[aria-haspopup='menu']) {
        grid-template-columns: ${iconSize} 1fr ${iconSize};
    }
    [part='start'] {
        display: contents;
    }
    slot[name='start']::slotted(*) {
        ${iconColor.cssCustomProperty}: currentcolor;
        width: ${iconSize};
        height: ${iconSize};
    }
    :host(.indent-1) [part='start'] {
        grid-column: 1;
    }
    :host(.indent-1) .content {
        grid-column: 2;
    }
    .expand-collapse-glyph-container {
        grid-row: 1;
        fill: currentcolor;
        width: ${iconSize};
        height: ${iconSize};
    }
    :host(.indent-0) .expand-collapse-glyph-container {
        grid-column: 2;
    }
    :host(.indent-1) .expand-collapse-glyph-container {
        grid-column: 3;
    }
`;
