import { elements, html, slotted, when } from '@ni/fast-element';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import type { ChatMessageToolSummary } from '.';
import { statusIconTemplate } from './status-icon.template';

export const template = html<ChatMessageToolSummary>`
    ${when(x => x.callCount > 0, html<ChatMessageToolSummary>`
        <button
            class="summary-button"
            type="button"
            aria-expanded="${x => x.expanded}"
            aria-controls="${x => x.toolCallListId}"
            aria-label="${x => `${x.summaryLabel}. ${x.disclosureLabel}`}"
            @click="${x => x.toggleExpanded()}"
        >
            <span class="status-icon">${statusIconTemplate}</span>
            <span class="summary-label">${x => x.summaryLabel}</span>
            <${iconArrowExpanderDownTag} class="disclosure-icon" aria-hidden="true"></${iconArrowExpanderDownTag}>
        </button>
        <div
            class="tool-call-list"
            id="${x => x.toolCallListId}"
            role="list"
            ?hidden="${x => !x.expanded}"
        >
            <slot ${slotted({ property: 'slottedToolCallElements', filter: elements() })}></slot>
        </div>
    `)}
    ${when(x => x.callCount === 0, html<ChatMessageToolSummary>`
        <slot class="empty-slot" ${slotted({ property: 'slottedToolCallElements', filter: elements() })}></slot>
    `)}
`;