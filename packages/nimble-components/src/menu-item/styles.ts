import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';

import {
    controlHeight,
    fillColorSelected,
    fillHoverColor,
    bodyFontColor,
    borderHoverColor,
    iconSize,
    bodyFont,
    bodyDisabledFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        contain: layout;
        overflow: visible;
        box-sizing: border-box;
        height: ${controlHeight};
        grid-template-columns: 0px 1fr;
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
    :host(:hover) {
        background: ${fillHoverColor};
    }
    :host(:active) {
        background: ${fillColorSelected};
    }
    :host([disabled]) {
        color: ${bodyDisabledFontColor};
        fill: currentcolor;
        cursor: default;
    }
    :host([disabled]:hover) {
        background: transparent;
    }
    :host(.indent-1) {
        grid-template-columns: ${iconSize} 1fr;
        column-gap: 8px;
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
`;
