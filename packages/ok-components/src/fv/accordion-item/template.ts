import { html } from '@ni/fast-element';
import { iconArrowExpanderRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-right';
import type { FvAccordionItem } from '.';

export const template = html<FvAccordionItem>`
    <details
        class="accordion-item-details"
        ?open="${x => x.expanded}"
        @toggle="${(x, c) => x.handleToggle(c.event)}"
    >
        <summary
            class="accordion-item-summary"
            aria-expanded="${x => x.expanded}"
        >
            <${iconArrowExpanderRightTag}
                class="accordion-item-icon"
            ></${iconArrowExpanderRightTag}>
            <span class="accordion-item-title" title="${x => x.header}">
                ${x => x.header}
            </span>
        </summary>
        <div class="accordion-item-content">
            <slot></slot>
        </div>
    </details>
`;
