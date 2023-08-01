import { html, ref } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    type FoundationElementTemplate,
    type AccordionItemOptions
} from '@microsoft/fast-foundation';
import type { AccordionItem } from '.';

/**
 * Reasoning for putting expanded icon inside of button is because allows focusVisible to wrap
 * around the entire button, and follows w3's guidelines about the button being the only element
 * inside of the heading element
 */

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<AccordionItem>,
AccordionItemOptions
> = (context, definition) => html`
    <template class="${x => (x.expanded ? 'expanded' : '')}">
        <div
            class="heading"
            part="heading"
            role="heading"
            aria-level="${x => x.headinglevel}"
        >
            <button
                class="button"
                part="button"
                ${ref('expandbutton')}
                aria-expanded="${x => x.expanded}"
                aria-controls="${x => x.id}-panel"
                id="${x => x.id}"
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            >
                <span class="icon" part="icon" aria-hidden="true">
                    <slot name="expanded-icon" part="expanded-icon">
                        ${definition.expandedIcon || ''}
                    </slot>
                    <slot name="collapsed-icon" part="collapsed-icon">
                        ${definition.collapsedIcon || ''}
                    </slot>
                </span>
                <span class="heading-content" part="heading-content">
                    <slot name="heading"></slot>
                </span>
            </button>
            ${startSlotTemplate(context, definition)}
            ${endSlotTemplate(context, definition)}
        </div>
        <div
            class="region"
            part="region"
            id="${x => x.id}-panel"
            role="region"
            aria-labelledby="${x => x.id}"
        >
            <slot></slot>
        </div>
    </template>
`;