import { html, ref, when } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type {
    FoundationElementTemplate,
    AccordionItemOptions
} from '@microsoft/fast-foundation';
import type { AccordionItem } from '.';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

/**
 * Reasoning for putting expanded icon inside of button is because allows focusVisible to wrap
 * around the entire button, and follows w3's guidelines about the button being the only element
 * inside of the heading element
 */

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<AccordionItem>,
AccordionItemOptions
> = (_context, definition) => html`
<template
    appearance="${x => x.appearance}"
>
    <details class="details" ?open="${x => x.open || x.expanded}" ${ref('details')}>
        <summary
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
                <span class="icon" part="icon">
                ${when(x => x.errorVisible, html`
                    <${iconExclamationMarkTag} class="error-icon"></${iconExclamationMarkTag}>
                `)}
                </span>
            </button>
        </summary>
        <div
            class="region"
            part="region"
            id="${x => x.id}-panel"
            role="region"
            aria-labelledby="${x => x.id}"
        >
            <slot></slot>
        </div>
    </details>
</template>
`;
