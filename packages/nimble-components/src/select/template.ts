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
import { overflow } from '../utilities/directive/overflow';
import { iconMagnifyingGlassTag } from '../icons/magnifying-glass';
import {
    filterNoResultsLabel,
    filterSearchLabel
} from '../label-provider/core/label-tokens';
import { FilterMode } from './types';

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
        aria-activedescendant="${x => (x.filterMode === FilterMode.none ? x.ariaActiveDescendant : null)}"
        aria-controls="${x => (x.filterMode === FilterMode.none ? x.ariaControls : null)}"
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
                        <div class="selected-value" part="selected-value" ${overflow('hasOverflow')} title=${x => (x.hasOverflow && x.displayValue ? x.displayValue : null)}>
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
            class="anchored-region"
            fixed-placement
            auto-update-mode="auto"
            vertical-default-position="${x => (x.positionAttribute === DropdownPosition.above ? 'top' : 'bottom')}"
            vertical-positioning-mode="${x => (!x.positionAttribute ? 'dynamic' : 'locktodefault')}"
            horizontal-default-position="center"
            horizontal-positioning-mode="locktodefault"
            horizontal-scaling="anchor"
            ?hidden="${x => (x.collapsible ? !x.open : false)}">
            <div class="listbox-background">
                <div
                    class="
                        listbox 
                        ${x => (x.filteredOptions.length === 0 ? 'empty' : '')}
                        ${x => x.positionAttribute}
                    "
                    id="${x => x.listboxId}"
                    part="listbox"
                    role="listbox"
                    ?disabled="${x => x.disabled}"
                    ${ref('listbox')}
                >
                    ${when(x => x.filterMode !== FilterMode.none, html<Select>`
                        <div class="filter-field ${x => x.positionAttribute}">
                            <${iconMagnifyingGlassTag} class="filter-icon"></${iconMagnifyingGlassTag}>
                            <input
                                class="filter-input"
                                aria-controls="${x => (x.open ? x.ariaControls : null)}"
                                aria-activedescendant="${x => (x.open ? x.ariaActiveDescendant : null)}"
                                ?disabled="${x => x.disabled}"
                                @input="${(x, c) => x.inputHandler(c.event as InputEvent)}"
                                @click="${(x, c) => x.inputClickHandler(c.event as MouseEvent)}"
                                ${ref('filterInputElement')}
                                placeholder="${x => filterSearchLabel.getValueFor(x)}"
                                value="${x => x.filter}"
                            />
                        </div>
                    `)}
                    <div ${ref('scrollableElement')}
                        class="scrollable-element">
                        <slot
                            ${slotted({
        filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n),
        flatten: true,
        property: 'slottedOptions',
    })}
                        ></slot>
                    </div>
                    ${when(x => (x.filterMode !== FilterMode.none && x.filteredOptions.length === 0), html<Select>`
                        <span class="no-results-label ${x => x.positionAttribute}">
                            ${x => filterNoResultsLabel.getValueFor(x)}
                        </span>
                    `)}
                </div>
            </div>
        </${anchoredRegionTag}>
    </template>
`;
