import { html, ref, slotted, when, type ViewTemplate } from '@ni/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { Chip, ChipOptions } from '.';
import { overflow } from '../utilities/directive/overflow';
import { buttonTag } from '../button';
import { toggleButtonTag } from '../toggle-button';
import { iconTimesTag } from '../icons/times';
import { ButtonAppearance } from '../button/types';

export const template: FoundationElementTemplate<
ViewTemplate<Chip>,
ChipOptions
> = (context, definition) => html<Chip>`
    <template
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    >
        ${when(x => x.selectable, html<Chip>`
            <${toggleButtonTag}
                class="toggle-button"
                appearance="${ButtonAppearance.ghost}"
                ?checked="${x => x.selected}"
                ?disabled="${x => x.disabled}"
                tabindex="${x => x.toggleButtonTabIndex ?? 0}"
                @click="${(x, c) => x.toggleButtonClickHandler(c.event as MouseEvent)}"
                @change="${(x, c) => x.toggleButtonChangeHandler(c.event)}"
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
            </${toggleButtonTag}>
        `)}
        ${when(x => !x.selectable, html<Chip>`
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
        `)}
        ${when(x => x.removable && !x.disabled, html<Chip>`
            <${buttonTag}
                class="remove-button"
                content-hidden
                appearance="${ButtonAppearance.ghost}"
                tabindex="${x => x.removeButtonTabIndex ?? 0}"
                @mousedown="${(x, c) => x.handleRemoveMousedown(c.event as MouseEvent)}"
                @click="${(x, c) => x.handleRemoveClick(c.event as MouseEvent)}"
                @keyup="${(x, c) => x.handleRemoveKeyup(c.event as KeyboardEvent)}"
            >
                <${iconTimesTag} slot="start"></${iconTimesTag}>
                ${x => x.removeButtonContent}
            </${buttonTag}>
        `)}
        ${endSlotTemplate(context, definition)}
    </template>
`;
