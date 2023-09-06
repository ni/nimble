import { children, html, ref, slotted } from '@microsoft/fast-element';
import type { TreeView } from '.';

// prettier-ignore
export const template = html<TreeView>`
    <template
        role="tree"
        ${ref('treeView')}
        ${children({ property: 'selectedItems', subtree: true, selector: '[role="treeitem"][selected]', attributeFilter: ['role', 'selected'] })}
        @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
        @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
        @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
        @selected-change="${(x, c) => x.handleSelectedChange(c.event)}"
    >
        <slot ${slotted('slottedTreeItems')}></slot>
    </template>
`;
