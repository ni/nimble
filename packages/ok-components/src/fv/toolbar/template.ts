import { children, elements, html, ref, slotted, type ViewTemplate } from '@ni/fast-element';
import { endSlotTemplate, startSlotTemplate, type FoundationElementTemplate, type ToolbarOptions } from '@ni/fast-foundation';
import { menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { iconThreeDotsLineTag } from '@ni/nimble-components/dist/esm/icons/three-dots-line';
import type { FvToolbar } from '.';

export const template: FoundationElementTemplate<ViewTemplate<FvToolbar>, ToolbarOptions> = (context, definition) => html<FvToolbar>`
    <template
        role="toolbar"
        aria-label="${x => x.ariaLabel}"
        aria-labelledby="${x => x.ariaLabelledby}"
        aria-orientation="horizontal"
        @mousedown="${(x, c) => x.mouseDownHandler(c.event as MouseEvent)}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        ${children({ property: 'childItems', attributeFilter: ['disabled', 'hidden'], filter: elements(), subtree: true })}
    >
        <div class="positioning-region" part="positioning-region">
            ${startSlotTemplate(context, definition)}
            <slot ${slotted({ property: 'slottedItems', filter: elements() })}></slot>
            ${endSlotTemplate(context, definition)}
            <${menuButtonTag}
                ${ref('overflowButton')}
                hidden
                appearance="ghost"
                content-hidden
                @keydown="${(x, c) => {
                    if (x.overflowButton.open) {
                        c.event.stopPropagation();
                    }
                    return true;
                }}"
            >
                <${iconThreeDotsLineTag} slot="start"></${iconThreeDotsLineTag}>
                ${x => x.overflowLabel}
                <${menuTag} slot="menu" ${ref('overflowMenu')}></${menuTag}>
            </${menuButtonTag}>
        </div>
    </template>
`;
