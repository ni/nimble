import {
    children,
    elements,
    html,
    ref,
    slotted,
    ViewTemplate,
    when
} from '@microsoft/fast-element';
import {
    TreeItemOptions,
    FoundationElementTemplate,
    startSlotTemplate,
    endSlotTemplate
} from '@microsoft/fast-foundation';
import type { TreeItem } from '.';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<TreeItem>,
TreeItemOptions
> = (context, definition) => html<TreeItem>`
    <template
        role="treeitem"
        slot="${x => (x.isNestedItem() ? 'item' : null)}"
        tabindex="-1"
        ?group-selected="${x => x.isGroupSelected()}"
        class="${x => (x.expanded ? 'expanded' : '')} ${x => (x.selected ? 'selected' : '')} ${x => (x.nested ? 'nested' : '')}
            ${x => (x.disabled ? 'disabled' : '')}"
        aria-expanded="${x => (x.childItems && x.childItemLength() > 0 ? x.expanded : null)}"
        aria-selected="${x => x.selected}"
        aria-disabled="${x => x.disabled}"
        @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
        ${children({ property: 'childItems', filter: elements() })}
    >
        <div class="positioning-region" part="positioning-region">
            <div class="content-region" part="content-region">
                ${when(
        x => x.childItems && x.childItemLength() > 0,
        html<TreeItem>`
                        <div
                            aria-hidden="true"
                            class="expand-collapse-button"
                            part="expand-collapse-button"
                            @click="${(x, c) => x.handleExpandCollapseButtonClick(c.event as MouseEvent)}"
                            ${ref('expandCollapseButton')}
                        >
                            <slot name="expand-collapse-glyph">
                                ${definition.expandCollapseGlyph || ''}
                            </slot>
                        </div>
                    `
    )}
                ${startSlotTemplate(context, definition)}
                <slot></slot>
                ${endSlotTemplate(context, definition)}
            </div>
        </div>
        ${when(
        x => x.childItems
                && x.childItemLength() > 0
                && (x.expanded || x.renderCollapsedChildren),
        html<TreeItem>`
            <div role="group" class="items" part="items">
                <slot name="item" ${slotted('items')}></slot>
            </div>
        `
    )}
    </template>
`;
