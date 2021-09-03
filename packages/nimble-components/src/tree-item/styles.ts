import { DirectionalStyleSheetBehavior } from '@microsoft/fast-components';
import { css, ElementStyles } from '@microsoft/fast-element';
import { display, ElementDefinitionContext, TreeItem, TreeItemOptions } from '@microsoft/fast-foundation';
import {
    contentFontColor,
    applicationBackgroundColor,
    fontFamily,
    borderColorHover,
    fillColorSelected,
    contentFontSize,
} from '../theme-provider/design-tokens';

const ltr = css`
    .expand-collapse-button svg {
        transform: rotate(90deg);
    }
    :host(.nested) .expand-collapse-button {
        left: var(--expand-collapse-button-nested-width, -16px);
    }
    :host([selected])::after {
        left: 1px;
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
        right: var(--expand-collapse-button-nested-width, -16px);
    }
    :host([selected])::after {
        right: 1px;
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(135deg);
    }
`;

export const styles: (
    context: ElementDefinitionContext,
    definition: TreeItemOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: TreeItemOptions) => css`
    ${display('block')} :host {
        contain: content;
        position: relative;
        outline: none;
        color: ${contentFontColor};
        background: ${applicationBackgroundColor};
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
    .positioning-region {
        display: flex;
        position: relative;
        box-sizing: border-box;
        height: 40px;
    }
    .positioning-region:hover {
        background: ${fillColorSelected};
    }
    .positioning-region:active {
        background: ${fillColorSelected};
    }
    .content-region {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        width: 100%;
        height: 16px;
        padding: 12px;
        font-size: ${contentFontSize};
    }
    .items {
        display: none;
        font-size: ${contentFontSize};
    }
    .expand-collapse-button {
        background: none;
        border: none;
        outline: none;
        width: 16px;
        height: 16px;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-left: 10px;
        margin-right: 18px;
    }
    .expand-collapse-button svg {
        width: 16px;
        height: 16px;
        transition: transform 0.2s ease-in;
        pointer-events: none;
        fill: currentcolor;
    }
    .start,
    .end {
        display: flex;
        fill: currentcolor;
    }

    ::slotted(svg) {
        width: 16px;
        height: 16px;
    }
    .start {
        margin-inline-end: 16px;
    }
    .end {
        margin-inline-start: 16px;
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
        margin-inline-start: 16px;
    }
    :host(.nested) .expand-collapse-button {
        position: absolute;
    }
    :host([selected])::after {
        /* The background needs to be calculated based on the selected background state
            for this control. We currently have no way of changing that, so setting to
            accent-foreground-rest for the time being */
        background: ${borderColorHover};
        border-radius: 0px;
        content: "";
        display: block;
        position: absolute;
        top: 0px;
        width: 2px;
        height: 40px;
    }
    ::slotted(${context.tagFor(TreeItem)}) {
        --tree-item-nested-width: 1em;
        --expand-collapse-button-nested-width: 15px;
    }`.withBehaviors(
        new DirectionalStyleSheetBehavior(ltr, rtl)
    );

// this block controlled indenting the nested items, it might end up being a useful trick
/* .positioning-region::before {
        content: "";
        display: block;
        width: var(--tree-item-nested-width);
        flex-shrink: 0;
    } */