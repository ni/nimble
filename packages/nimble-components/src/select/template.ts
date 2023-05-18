import {
    html,
    ref,
    slotted,
    ViewTemplate,
    when
} from '@microsoft/fast-element';
import {
    endSlotTemplate,
    FoundationElementTemplate,
    Listbox,
    SelectOptions,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import type { Select } from '.';
import { anchoredRegionTag } from '../anchored-region';
import { DropdownPosition } from '../patterns/dropdown/types';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Select>,
SelectOptions
> = (context, definition) => html<Select>`
    <template
        class="${x => [
        x.collapsible && 'collapsible',
        x.collapsible && x.open && 'open',
        x.disabled && 'disabled',
        x.collapsible && x.position,
    ]
        .filter(Boolean)
        .join(' ')}"
        aria-activedescendant="${x => x.ariaActiveDescendant}"
        aria-controls="${x => x.ariaControls}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-expanded="${x => x.ariaExpanded}"
        aria-haspopup="${x => (x.collapsible ? 'listbox' : null)}"
        aria-multiselectable="${x => x.ariaMultiSelectable}"
        ?open="${x => x.open}"
        role="combobox"
        tabindex="${x => (!x.disabled ? '0' : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event as MouseEvent)}"
    >
        ${when(
        x => x.collapsible,
        html<Select>`
                <div
                    class="control"
                    part="control"
                    ?disabled="${x => x.disabled}"
                    ${ref('control')}
                >
                    ${startSlotTemplate(context, definition)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${x => x.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${definition.indicator || ''}
                            </slot>
                        </div>
                    </slot>
                    ${endSlotTemplate(context, definition)}
                </div>
                `
    )}
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
                ?hidden="${x => (x.collapsible ? !x.open : false)}"
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
