import { html, ref, slotted, when, type ViewTemplate } from '@ni/fast-element';
import {
    startSlotTemplate,
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { Chip, ChipOptions } from '.';
import { overflow } from '../utilities/directive/overflow';
import { buttonTag } from '../button';
import { iconTimesTag } from '../icons/times';
import { ButtonAppearance } from '../button/types';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Chip>,
ChipOptions
> = (context, definition) => html<Chip>`
    <template>
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
                tabindex="${x => x.resolvedTabIndex}"
                @click="${x => x.handleRemoveClick()}"
            >
                <${iconTimesTag} slot="start"></${iconTimesTag}>
                ${x => x.removeButtonContent}
            </${buttonTag}>
        `)}
    </template>
`;
