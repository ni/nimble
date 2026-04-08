import { html } from '@ni/fast-element';
import { iconArrowExpanderRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-right';
import type { AccordionItem } from '.';

const arrowExpanderRightTag = iconArrowExpanderRightTag;

export const template = html<AccordionItem>`
    <details
        class="accordion-item-details"
        ?open="${x => x.expanded}"
        @toggle="${(x, c) => x.handleToggle(c.event)}"
    >
        <summary
            class="accordion-item-summary"
            aria-expanded="${x => x.expanded}"
        >
            <${arrowExpanderRightTag}
                class="accordion-item-icon"
            ></${arrowExpanderRightTag}>
            <span class="accordion-item-title" title="${x => x.header}">
                ${x => x.header}
            </span>
        </summary>
        <div class="accordion-item-content">
            <slot></slot>
        </div>
    </details>
`;
