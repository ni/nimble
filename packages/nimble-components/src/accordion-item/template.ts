import { html, ref } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type {
    FoundationElementTemplate,
    AccordionItemOptions
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
    <details ?open="${x => x.open}">
            <summary
                class="button"
                part="header"
                role="button"
                ${ref('expandbutton')}
                aria-expanded="${x => x.open}"
                aria-level="${x => x.headinglevel}"
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
`;