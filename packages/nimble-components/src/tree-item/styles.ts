import { css, ElementStyles } from '@microsoft/fast-element';
import {
    display,
    ElementDefinitionContext,
    TreeItem,
    TreeItemOptions
} from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';
import {
    bodyFontColor,
    borderHoverColor,
    fillSelectedColor,
    fillHoverColor,
    fillHoverSelectedColor,
    borderWidth,
    iconSize,
    bodyFont
} from '../theme-provider/design-tokens';
import { groupSelectedAttribute } from '../tree-view/types';
import { DirectionalStyleSheetBehavior } from '../utilities/style/direction';

export const styles: (
    context: ElementDefinitionContext,
    definition: TreeItemOptions
) => ElementStyles = (context: ElementDefinitionContext) => css`
        ${display('block')}

        :host {
            contain: content;
            position: relative;
            outline: none;
            color: ${bodyFontColor};
            cursor: pointer;
            --ni-private-tree-item-nested-width: 0;
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
            font: ${bodyFont};
            user-select: none;
        }

        :host(${focusVisible}) .content-region {
            outline: none;
        }

        :host(.nested) .content-region {
            position: relative;
            margin-inline-start: ${iconSize};
        }

        :host([disabled]) .content-region {
            opacity: 0.5;
            cursor: not-allowed;
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
            cursor: pointer;
            margin-left: 10px;
        }

        :host(.nested) .expand-collapse-button {
            position: absolute;
        }

        .expand-collapse-button svg {
            width: ${iconSize};
            height: ${iconSize};
            transition: transform 0.2s ease-in;
            pointer-events: none;
            fill: currentcolor;
        }

        ${
            /* this rule keeps children without an icon text aligned with parents */ ''
        }
        span[part="start"] {
            width: ${iconSize};
        }

        ${
            /* the start class is applied when the corresponding slots is filled */ ''
        }
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

        ::slotted(${context.tagFor(TreeItem)}) {
            --ni-private-tree-item-nested-width: 1em;
            --ni-private-expand-collapse-button-nested-width: calc(
                ${iconSize} * -1
            );
        }

        ${
            /* the end class is applied when the corresponding slots is filled */ ''
        }
        .end {
            display: flex;
            fill: currentcolor;
            margin-inline-start: ${iconSize};
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
    `
// prettier-ignore
    .withBehaviors(
        new DirectionalStyleSheetBehavior(
            css`
                    ${/* ltr styles */ ''}
                    :host(.nested) .expand-collapse-button {
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
            css`
                    ${/* rtl styles */ ''}
                    :host(.nested) .expand-collapse-button {
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
