import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
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
    bodyFontSize
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

    .control {
        display: flex;
        text-decoration: none;
        color: ${bodyFontColor};
    }

    .control${focusVisible} {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -2px;
    }

    :host([disabled]) .control {
        cursor: not-allowed;
    }

    .positioning-region {
        display: flex;
        position: relative;
        box-sizing: border-box;
        height: calc(${iconSize} * 2);
        width: 100%;
    }

    .positioning-region:hover {
        background: ${fillHoverColor};
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
        padding-left: 10px;
        font: inherit;
        font-size: ${bodyFontSize};
        ${userSelectNone}
        position: relative;
        margin-inline-start: ${iconSize};
    }

    :host([disabled]) .content-region {
        opacity: 0.5;
        cursor: not-allowed;
    }

    ${
        /* this rule keeps children without an icon text aligned with parents */ ''
    }
    span[part="start"] {
        width: ${iconSize};
    }

    ${/* the start class is applied when the corresponding slot is filled */ ''}
    .start {
        display: flex;
        fill: currentcolor;
        margin-inline-start: ${iconSize};
        margin-inline-end: ${iconSize};
    }

    slot[name='start']::slotted(*) {
        width: ${iconSize};
        height: ${iconSize};
    }

    ${/* the end class is applied when the corresponding slot is filled */ ''}
    .end {
        display: flex;
        fill: currentcolor;
        margin-inline-start: ${iconSize};
    }
`;
