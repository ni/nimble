import { html, ref, slotted, when, type ViewTemplate } from '@ni/fast-element';
import {
    startSlotTemplate,
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { Chip, ChipOptions } from '.';
import { overflow } from '../utilities/directive/overflow';

export const template: FoundationElementTemplate<
ViewTemplate<Chip>,
ChipOptions
> = (context, definition) => html<Chip>`
    <template
        aria-disabled="${x => x.disabled}"
        @keydown="${(x, c) => x.keyDownHandler(c.event as KeyboardEvent)}"
    >
        ${startSlotTemplate(context, definition)}
        <span
            class="content"
            part="content"
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.elementTextContent
        ? x.elementTextContent
        : null)}
        >
            <slot
                ${ref('contentSlot')}
                ${slotted({ property: 'content' })}
            ></slot>
        </span>
        ${when(
        x => x.removable,
        html<Chip>`
                <nimble-button
                    class="remove-button"
                    content-hidden
                    appearance="ghost"
                    @click="${x => x.handleRemoveClick()}"
                >
                    <nimble-icon-times slot="start"> </nimble-icon-times>
                    ${x => x.removeButtonContent}
                </nimble-button>
            `
    )}
    </template>
`;
