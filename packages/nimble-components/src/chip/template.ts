import { html, ref, slotted, when, type ViewTemplate } from '@ni/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { Chip, ChipOptions } from '.';
import { overflow } from '../utilities/directive/overflow';
import { buttonTag } from '../button';
import { iconTimesTag } from '../icons/times';
import { ButtonAppearance } from '../button/types';
import { ChipSelectionMode } from './types';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Chip>,
ChipOptions
> = (context, definition) => html<Chip>`
    <template
        role="${x => (x.selectionMode === ChipSelectionMode.single ? 'button' : undefined)}"
        aria-pressed="${x => (x.selectionMode === ChipSelectionMode.single ? x.selected : undefined)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
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
        ${when(x => x.removable && !x.disabled, html<Chip>`
            <${buttonTag}
                class="remove-button"
                content-hidden
                appearance="${ButtonAppearance.ghost}"
                tabindex="${x => (x.selectionMode === ChipSelectionMode.single ? '-1' : x.tabIndex)}"
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
