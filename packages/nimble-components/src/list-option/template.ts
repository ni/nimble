// Based on template in FAST repo: https://github.com/microsoft/fast/blob/2ea80697bc3a5193e6123fb08ac3be2a76571aeb/packages/web-components/fast-foundation/src/listbox-option/listbox-option.template.ts
import { html, ref, slotted } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import { startSlotTemplate, type FoundationElementTemplate, type ListboxOptionOptions, endSlotTemplate } from '@microsoft/fast-foundation';
import type { ListOption } from '.';
import { overflow } from '../utilities/directive/overflow';

/**
 * The template for the {@link @microsoft/fast-foundation#(ListboxOption:class)} component.
 * @public
 */
export const template: FoundationElementTemplate<
ViewTemplate<ListOption>,
ListboxOptionOptions
> = (context, definition) => html`
    <template
        aria-checked="${x => x.ariaChecked}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-posinset="${x => x.ariaPosInSet}"
        aria-selected="${x => x.ariaSelected}"
        aria-setsize="${x => x.ariaSetSize}"
        class="${x => [x.checked && 'checked', x.selected && 'selected', x.disabled && 'disabled']
        .filter(Boolean)
        .join(' ')}"
        role="option"
    >
        ${startSlotTemplate(context, definition)}
        <span
            class="content"
            part="content"
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.headerTextContent ? x.headerTextContent : null)}
        >
            <slot ${ref('contentSlot')} ${slotted('content')}></slot>
        </span>
        ${endSlotTemplate(context, definition)}
    </template>
`;