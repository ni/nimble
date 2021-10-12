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
    contentFontColorDisabled,
    iconSize
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
        color: ${contentFontColor};
        fill: currentcolor;
        cursor: pointer;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
    }
    :host(${focusVisible}) {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderColorHover} inset;
        outline: ${borderWidth} solid ${borderColorHover};
        outline-offset: -2px;
    }
    :host(:hover) {
        background: ${fillColorHover};
    }
    :host(:active) {
        background: ${fillColorSelected};
    }
    :host([disabled]) {
        color: ${contentFontColorDisabled};
        fill: currentcolor;
        cursor: default;
    }
    :host([disabled]:hover) {
        background: transparent;
    }
    :host(.nimble-indent) {
        grid-template-columns: ${iconSize} 1fr;
        column-gap: 8px;
    }
    :host(.nimble-indent) .content {
        grid-column: 2;
    }
    [part='icon'] {
        display: contents;
    }
    slot[name='icon']::slotted(*) {
        fill: currentcolor;
        width: ${iconSize};
        height: ${iconSize};
    }
    :host(.nimble-indent) .icon {
        grid-column: 1;
    }
    [part='start'] {
        display: none;
    }
    [part='end'] {
        display: none;
    }
`;
