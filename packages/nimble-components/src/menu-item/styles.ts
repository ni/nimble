import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';

import {
    controlHeight,
    fontFamily,
    contentFontSize,
    fillColorSelected,
    fillColorHover,
    contentFontColor,
    borderColorHover,
    borderWidth,
    contentFontColorDisabled
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')} :host {
        contain: layout;
        overflow: visible;
        box-sizing: border-box;
        height: ${controlHeight};
        grid-template-columns: minmax(42px, auto) 1fr minmax(42px, auto);
        grid-template-rows: auto;
        justify-items: start;
        align-items: center;
        padding: 0;
        margin: 0 0;
        white-space: nowrap;
        color: ${contentFontColor};
        fill: currentcolor;
        cursor: pointer;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
    }

    :host(.indent-0) {
        grid-template-columns: auto 1fr minmax(42px, auto);
    }
    :host(.indent-0) .content {
        grid-column: 1;
        grid-row: 1;
        margin-inline-start: 10px;
    }
    :host(.indent-0) .expand-collapse-glyph-container {
        grid-column: 5;
        grid-row: 1;
    }
    :host(.indent-2) {
        grid-template-columns: minmax(42px, auto) minmax(42px, auto) 1fr minmax(42px, auto) minmax(42px, auto);
    }
    :host(.indent-2) .content {
        grid-column: 3;
        grid-row: 1;
        margin-inline-start: 10px;
    }
    :host(.indent-2) .expand-collapse-glyph-container {
        grid-column: 5;
        grid-row: 1;
    }
    :host(.indent-2) .start {
        grid-column: 2;
    }
    :host(.indent-2) .end {
        grid-column: 4;
    }
    :host(${focusVisible}) {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderColorHover} inset;
        outline: ${borderWidth} solid ${borderColorHover};
        outline-offset: -2px;
    }
    :host(:hover) {
        background: ${fillColorHover};
    }
    :host([aria-checked="true"]),
    :host(:active),
    :host(.expanded) {
        background: ${fillColorSelected};
    }
    :host([disabled]) {
        color: ${contentFontColorDisabled}
    }
`;