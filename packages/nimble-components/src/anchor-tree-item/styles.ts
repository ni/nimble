import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import {
    bodyFontFamily,
    bodyFontWeight,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    iconSize,
    fillHoverColor,
    fillHoverSelectedColor,
    fillSelectedColor,
    bodyFontSize,
    bodyDisabledFontColor,
    iconColor,
    treeViewPaddingLeftSize
} from '../theme-provider/design-tokens';
import { focusVisible } from '../utilities/style/focus';
import { userSelectNone } from '../utilities/style/user-select';

export const styles = css`
    ${display('block')}

    :host {
        ${
            /* don't set font-size here or else it overrides what we set on .items */ ''
        }
        font-family: ${bodyFontFamily};
        font-weight: ${bodyFontWeight};
        contain: content;
        position: relative;
        outline: none;
        color: ${bodyFontColor};
        cursor: pointer;
        --ni-private-tree-item-nested-width: 0;
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
        cursor: default;
    }

    .control {
        display: flex;
        text-decoration: none;
        color: inherit;
    }

    .control${focusVisible} {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -2px;
    }

    .positioning-region {
        display: flex;
        position: relative;
        height: calc(${iconSize} * 2);
        width: 100%;
    }

    .positioning-region:hover {
        background: ${fillHoverColor};
    }

    :host([disabled]) .positioning-region:hover {
        background: transparent;
    }

    :host([selected]) .positioning-region {
        background: ${fillSelectedColor};
    }

    :host([selected]) .positioning-region:hover {
        background: ${fillHoverSelectedColor};
    }

    .positioning-region::before {
        content: '';
        display: block;
        width: var(--ni-private-tree-item-nested-width);
        flex-shrink: 0;
    }

    .content-region {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        width: 100%;
        padding-left: ${treeViewPaddingLeftSize};
        font: inherit;
        font-size: ${bodyFontSize};
        ${userSelectNone}
        position: relative;
        margin-inline-start: ${iconSize};
    }

    ${
        /* this rule keeps children without an icon text aligned with parents */ ''
    }
    [part="start"] {
        width: ${iconSize};
        pointer-events: none;
    }

    ${/* the start class is applied when the corresponding slot is filled */ ''}
    .start {
        display: flex;
        margin-inline-start: ${iconSize};
        margin-inline-end: ${iconSize};
    }

    slot[name='start']::slotted(*) {
        ${iconColor.cssCustomProperty}: currentcolor;
        width: ${iconSize};
        height: ${iconSize};
    }

    .content {
        pointer-events: none;
    }

    [part='end'] {
        display: none;
    }
`;
