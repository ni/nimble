import { type ViewTemplate, html, ref, slotted } from '@microsoft/fast-element';
import {
    type FoundationElementTemplate,
    type ComboboxOptions,
    startSlotTemplate,
    endSlotTemplate,
    Listbox
} from '@microsoft/fast-foundation';
import type { Combobox } from '.';
import { anchoredRegionTag } from '../anchored-region';
import { DropdownPosition } from '../patterns/dropdown/types';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Combobox>,
ComboboxOptions
> = (context, definition) => html`
    <template
        aria-disabled="${x => x.ariaDisabled}"
        autocomplete="${x => x.autocomplete}"
        class="${x => (x.open ? 'open' : '')} ${x => (x.disabled ? 'disabled' : '')} ${x => x.position}"
        ?open="${x => x.open}"
        tabindex="${x => (!x.disabled ? '0' : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    >
        <div class="control" part="control" ${ref('controlWrapper')}>
            ${startSlotTemplate(context, definition)}
            <slot name="control">
                <input
                    aria-activedescendant="${x => (x.open ? x.ariaActiveDescendant : null)}"
                    aria-autocomplete="${x => x.ariaAutoComplete}"
                    aria-controls="${x => x.ariaControls}"
                    aria-disabled="${x => x.ariaDisabled}"
                    aria-expanded="${x => x.ariaExpanded}"
                    aria-haspopup="listbox"
                    class="selected-value"
                    part="selected-value"
                    placeholder="${x => x.placeholder}"
                    role="combobox"
                    type="text"
                    ?disabled="${x => x.disabled}"
                    :value="${x => x.value}"
                    @input="${(x, c) => x.inputHandler(c.event as InputEvent)}"
                    @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
                    ${ref('control')}
                />
                <div class="indicator" part="indicator" aria-hidden="true">
                    <slot name="indicator">
                        ${definition.indicator || ''}
                    </slot>
                </div>
            </slot>
            ${endSlotTemplate(context, definition)}
        </div>
        <${anchoredRegionTag}
            ${ref('region')}
            class="anchoredRegion"
            fixed-placement
            auto-update-mode="auto"
            vertical-default-position="${x => (x.positionAttribute === DropdownPosition.above ? 'top' : 'bottom')}"
            vertical-positioning-mode="${x => (!x.positionAttribute ? 'dynamic' : 'locktodefault')}"
            vertical-scaling="fill"
            horizontal-default-position="center"
            horizontal-positioning-mode="locktodefault"
            horizontal-scaling="anchor">
            <div
                class="listbox"
                id="${x => x.listboxId}"
                part="listbox"
                role="listbox"
                ?disabled="${x => x.disabled}"
                ?hidden="${x => !x.open}"
                ${ref('listbox')}
            >
                <slot
                    ${slotted({
        filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n),
        flatten: true,
        property: 'slottedOptions',
    })}
                ></slot>
            </div>
        </${anchoredRegionTag}>
    </template>
`;
