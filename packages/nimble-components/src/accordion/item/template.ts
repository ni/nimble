import { html, ref } from '@ni/fast-element';
import type { ViewTemplate } from '@ni/fast-element';
import {
    endSlotTemplate,
    type FoundationElementDefinition,
    type FoundationElementTemplate,
    startSlotTemplate,
    type StartEndOptions
} from '@ni/fast-foundation';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import type { AccordionItem } from '.';

type AccordionItemOptions = FoundationElementDefinition & StartEndOptions;

export const template: FoundationElementTemplate<
ViewTemplate<AccordionItem>,
AccordionItemOptions
> = (context, definition) => html<AccordionItem>`
    <template
        class="accordion-item ${x => (x.disabled ? 'disabled' : '')} ${x => (x.expanded ? 'expanded' : '')}"
    >
        <button
            id="${x => x.headerElementId}"
            class="control"
            part="control"
            aria-expanded="${x => x.headerAriaExpanded}"
            aria-controls="${x => x.headerAriaControls}"
            ?disabled="${x => x.disabled}"
            ${ref('headerControl')}
            @click="${x => x.handleHeaderClick()}"
            @keydown="${(x, c) => x.handleKeydown(c.event as KeyboardEvent)}"
        >
            ${startSlotTemplate(context, definition)}
            <span class="heading" part="heading">
                <slot name="heading">${x => x.heading || ''}</slot>
            </span>
            ${endSlotTemplate(context, definition)}
            <span aria-hidden="true" class="icon" part="icon">
                <${iconArrowExpanderDownTag}></${iconArrowExpanderDownTag}>
            </span>
        </button>
        <div
            id="${x => x.regionElementId}"
            class="region"
            part="region"
            role="region"
            aria-labelledby="${x => x.regionAriaLabelledby}"
            ?hidden="${x => !x.expanded}"
            ${ref('region')}
        >
            <div class="content" part="content">
                <slot></slot>
            </div>
        </div>
    </template>
`;
