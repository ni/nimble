import { html, ref, slotted, when, type ViewTemplate } from '@ni/fast-element';
import {
    startSlotTemplate,
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { Chip, ChipOptions } from '.';
import { overflow } from '../utilities/directive/overflow';
import { buttonTag } from '../button';
import { iconTimesTag } from '../icons/times';

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
                <${buttonTag}
                    class="remove-button"
                    content-hidden
                    appearance="ghost"
                    tabindex="${x => (!x.disabled ? '0' : null)}"
                    @click="${x => x.handleRemoveClick()}"
                >
                    <${iconTimesTag} slot="start"></${iconTimesTag}>
                    ${x => x.removeButtonContent}
                </${buttonTag}>
            `
    )}
    </template>
`;
