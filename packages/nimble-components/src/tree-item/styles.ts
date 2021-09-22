import { DirectionalStyleSheetBehavior } from '@microsoft/fast-components';
import { css, ElementStyles } from '@microsoft/fast-element';
import {
    display,
    ElementDefinitionContext,
    TreeItem,
    TreeItemOptions
} from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import {
    contentFontColor,
    fontFamily,
    borderColorHover,
    fillColorSelected,
    contentFontSize,
    fillColorHover,
    fillColorSelectedHover,
    borderWidth,
    iconSize
} from '../theme-provider/design-tokens';

/* ltr and rtl control the rotation of the expand chevron */
const ltr = css`
    .expand-collapse-button svg {
        transform: rotate(90deg);
    }
    :host(.nested) .expand-collapse-button {
        left: var(
            --expand-collapse-button-nested-width,
            calc(${iconSize} * -1)
        );
    }
    :host([expanded]) > .positioning-region .expand-collapse-button svg {
        transform: rotate(180deg);
    }
`;

const rtl = css`
    .expand-collapse-button svg {
        transform: rotate(180deg);
    }
    :host(.nested) .expand-collapse-button {
        right: var(
            --expand-collapse-button-nested-width,
            calc(${iconSize} * -1)
        );
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(135deg);
    }
`;

export const styles: (
    context: ElementDefinitionContext,
    definition: TreeItemOptions
) => ElementStyles = (context: ElementDefinitionContext) => css`
        ${display('block')} :host {
            contain: content;
            position: relative;
            outline: none;
            color: ${contentFontColor};
            cursor: pointer;
            font-family: ${fontFamily};
            --tree-item-nested-width: 0;
        }
        :host(:focus) > .positioning-region {
            outline: none;
        }
        :host(:focus) .content-region {
            outline: none;
        }
        :host(${focusVisible}) .positioning-region {
            box-shadow: 0px 0px 0px ${borderWidth} ${borderColorHover} inset;
            outline: ${borderWidth} solid ${borderColorHover};
            outline-offset: -2px;
        }
        .positioning-region {
            display: flex;
            position: relative;
            box-sizing: border-box;
            height: calc(${iconSize} * 2);
        }
        .positioning-region::before {
            content: '';
            display: block;
            width: var(--tree-item-nested-width);
            flex-shrink: 0;
        }
        .content-region {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            width: 100%;
            padding-left: 10px;
            font-size: ${contentFontSize};
            user-select: none;
        }
        ${
            /*
             * this rule keeps children without an icon text aligned with parents 
             * fast-foundataion does not put a specific class name on this span
             */''
        }
        .content-region span:nth-of-type(1) {
            width: ${iconSize};
        }
        .items {
            display: none;
            ${
                /*
                 * this controls the nested indentation (by affecting .positioning-region::before)
                 * it must minimally contain arithmetic with an em and a px value
                 * make it larger or shorter by changing the px value
                 */''
            }
            font-size: calc(1em + (${iconSize} * 2));
        }
        .expand-collapse-button {
            background: none;
            border: none;
            outline: none;
            width: ${iconSize};
            height: ${iconSize};
            padding: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-left: 10px;
        }
        .expand-collapse-button svg {
            width: ${iconSize};
            height: ${iconSize};
            transition: transform 0.2s ease-in;
            pointer-events: none;
            fill: currentcolor;
        }
        slot[name='start']::slotted(*) {
            width: ${iconSize};
            height: ${iconSize};
        }
        ${/* the start and end classes are applied when the corresponding slots are filled */ ''}
        .start,
        .end {
            display: flex;
            fill: currentcolor;
        }
        .start {
            margin-inline-start: ${iconSize};
            margin-inline-end: ${iconSize};
        }
        .end {
            margin-inline-start: ${iconSize};
        }
        :host([expanded]) > .items {
            display: block;
        }
        :host([disabled]) .content-region {
            opacity: 0.5;
            cursor: not-allowed;
        }
        :host(.nested) .content-region {
            position: relative;
            margin-inline-start: ${iconSize};
        }
        :host(.nested) .expand-collapse-button {
            position: absolute;
        }
        .positioning-region:hover {
            background: ${fillColorHover};
        }
        :host([selected]) .positioning-region {
            background: ${fillColorSelected};
        }
        :host([selected]) .positioning-region:hover {
            background: ${fillColorSelectedHover};
        }
        ${/* this controls the side border */''}
        :host([selected])::after {
            background: ${borderColorHover};
            border-radius: 0px;
            content: '';
            display: block;
            position: absolute;
            top: 0px;
            width: calc(${borderWidth} * 2);
            height: calc(${iconSize} * 2);
        }
        ::slotted(${context.tagFor(TreeItem)}) {
            --tree-item-nested-width: 1em;
            --expand-collapse-button-nested-width: calc(${iconSize} * -1);
        }
    `.withBehaviors(new DirectionalStyleSheetBehavior(ltr, rtl));
