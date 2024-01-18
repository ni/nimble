import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import {
    bodyFontColor,
    bodyFontFamily,
    bodyFontSize,
    bodyFontWeight,
    borderHoverColor,
    fillSelectedColor,
    fillHoverColor,
    fillHoverSelectedColor,
    borderWidth,
    iconSize,
    mediumDelay,
    bodyDisabledFontColor,
    iconColor
} from '../theme-provider/design-tokens';
import { groupSelectedAttribute } from '../tree-view/types';
import { DirectionalStyleSheetBehavior } from '../utilities/style/direction';
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

    ${/* this controls the side border */ ''}
    :host([${groupSelectedAttribute}])::after {
        background: ${borderHoverColor};
        border-radius: 0px;
        content: '';
        display: block;
        position: absolute;
        top: 0px;
        width: calc(${borderWidth} * 2);
        height: calc(${iconSize} * 2);
    }

    .positioning-region {
        display: flex;
        position: relative;
        box-sizing: border-box;
        height: calc(${iconSize} * 2);
    }

    .positioning-region:hover {
        background: ${fillHoverColor};
    }

    :host([${groupSelectedAttribute}]) .positioning-region:hover {
        background: ${fillHoverSelectedColor};
    }

    :host(${focusVisible}) .positioning-region {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -2px;
    }

    :host([selected]) .positioning-region {
        background: ${fillSelectedColor};
    }

    :host([selected]) .positioning-region:hover {
        background: ${fillHoverSelectedColor};
    }

    :host([disabled]) .positioning-region:hover {
        background-color: transparent;
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

    :host(${focusVisible}) .content-region {
        outline: none;
    }

    .expand-collapse-button {
        background: none;
        border: none;
        outline: none;
        width: ${iconSize};
        height: ${iconSize};
        padding: 0px;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
        position: absolute;
    }

    .expand-collapse-button svg {
        width: ${iconSize};
        height: ${iconSize};
        transition: transform ${mediumDelay} ease-in;
        pointer-events: none;
        fill: currentcolor;
    }

    ${
        /* this rule keeps children without an icon text aligned with parents */ ''
    }
    [part="start"] {
        width: ${iconSize};
    }

    ${
        /* the start class is applied when the corresponding slots is filled */ ''
    }
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

    ::slotted([role='treeitem']) {
        --ni-private-tree-item-nested-width: 1em;
        --ni-private-expand-collapse-button-nested-width: calc(
            ${iconSize} * -1
        );
    }

    [part='end'] {
        display: none;
    }

    .items {
        display: none;
        ${
            /*
             * this controls the nested indentation (by affecting .positioning-region::before)
             * it must minimally contain arithmetic with an em and a px value
             * make it larger or shorter by changing the px value
             */ ''
        }
        font-size: calc(1em + (${iconSize} * 2));
    }

    :host([expanded]) .items {
        display: block;
    }
`.withBehaviors(
    new DirectionalStyleSheetBehavior(
        // ltr styles
        css`
            .expand-collapse-button {
                left: var(
                    --ni-private-expand-collapse-button-nested-width,
                    calc(${iconSize} * -1)
                );
            }

            .expand-collapse-button svg {
                transform: rotate(90deg);
            }

            :host([expanded]) .expand-collapse-button svg {
                transform: rotate(180deg);
            }
        `,
        // rtl styles
        css`
            .expand-collapse-button {
                right: var(
                    --ni-private-expand-collapse-button-nested-width,
                    calc(${iconSize} * -1)
                );
            }

            .expand-collapse-button svg {
                transform: rotate(180deg);
            }

            :host([expanded]) .expand-collapse-button svg {
                transform: rotate(135deg);
            }
        `
    )
);
