import { html, ref, slotted, ViewTemplate, when } from '@ni/fast-element';
import {
    endSlotTemplate,
    type FoundationElementTemplate,
    type SelectOptions,
    startSlotTemplate
} from '@ni/fast-foundation';
import type { Select } from '.';
import { anchoredRegionTag } from '../anchored-region';
import { DropdownPosition } from '../patterns/dropdown/types';
import { overflow } from '../utilities/directive/overflow';
import { iconMagnifyingGlassTag } from '../icons/magnifying-glass';
import {
    filterNoResultsLabel,
    filterSearchLabel,
    loadingLabel
} from '../label-provider/core/label-tokens';
import { FilterMode } from './types';
import { ListOptionGroup } from '../list-option-group';
import { buttonTag } from '../button';
import { iconTimesTag } from '../icons/times';
import { ListOption } from '../list-option';
import { spinnerTag } from '../spinner';
import { createRequiredVisibleLabelTemplate } from '../patterns/required-visible/template';

export const isListOption = (
    el: Element | undefined | null
): el is ListOption => {
    return el instanceof ListOption;
};

export const isListOptionGroup = (
    n: Element | undefined | null
): n is ListOptionGroup => {
    return n instanceof ListOptionGroup;
};

const labelTemplate = createRequiredVisibleLabelTemplate(html<Select>`
    <label part="label" class="label" aria-hidden="true">
        <slot ${ref('labelSlot')}></slot>
    </label>
`);

/* eslint-disable @typescript-eslint/indent */
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
            ].filter(Boolean).join(' ')}"
        aria-activedescendant="${x => (x.filterMode === FilterMode.none ? x.ariaActiveDescendant : null)}"
        aria-controls="${x => (x.filterMode === FilterMode.none ? x.ariaControls : null)}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-expanded="${x => x.ariaExpanded}"
        aria-haspopup="${x => (x.collapsible ? 'listbox' : null)}"
        aria-label="${x => x.labelContent}"
        aria-multiselectable="${x => x.ariaMultiSelectable}"
        aria-required="${x => x.requiredVisible}"
        ?open="${x => x.open}"
        role="combobox"
        tabindex="${x => (!x.disabled ? '0' : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @contentchange="${x => x.updateDisplayValue()}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event as MouseEvent)}"
    >
        ${labelTemplate}
        ${when(x => x.collapsible, html<Select>`
            <div
                class="control"
                part="control"
                ?disabled="${x => x.disabled}"
                ${ref('control')}
            >
                ${startSlotTemplate(context, definition)}
                <slot name="button-container">
                    <div class="selected-value ${x => (x.displayPlaceholder ? 'placeholder' : '')}" part="selected-value" ${overflow('hasOverflow')} title=${x => (x.hasOverflow && x.displayValue ? x.displayValue : null)}>
                        <slot name="selected-value">${x => x.displayValue}</slot>
                    </div>
                    ${when(x => !x.disabled && x.clearable && !x.displayPlaceholder && x.selectedIndex >= 0, html<Select>`
                        <${buttonTag} 
                            class="clear-button"
                            tabindex="-1"
                            part="clear-button"
                            content-hidden
                            appearance="ghost"
                            @click="${(x, c) => x.clearClickHandler(c.event as MouseEvent)}">
                            <${iconTimesTag} slot="start"></${iconTimesTag}>
                        </${buttonTag}>
                    `)}
                    <div aria-hidden="true" class="indicator" part="indicator">
                        <slot name="indicator">
                            ${definition.indicator || ''}
                        </slot>
                    </div>
                </slot>
                ${endSlotTemplate(context, definition)}
            </div>
            `)
        }
        <${anchoredRegionTag}
            ${ref('anchoredRegion')}
            class="anchored-region confined-to-view"
            fixed-placement
            auto-update-mode="auto"
            vertical-default-position="${x => (x.positionAttribute === DropdownPosition.above ? 'top' : 'bottom')}"
            vertical-positioning-mode="${x => (!x.positionAttribute ? 'dynamic' : 'locktodefault')}"
            horizontal-default-position="center"
            horizontal-positioning-mode="locktodefault"
            horizontal-scaling="anchor"
            @loaded="${x => x.regionLoadedHandler()}"
            ?hidden="${x => (x.collapsible ? !x.open : false)}">
            <div class="listbox-background">
                <div
                    class="
                        listbox
                        ${x => (x.filteredOptions.length === 0 ? 'empty' : '')}
                        ${x => x.position || ''}
                    "
                    id="${x => x.listboxId}"
                    part="listbox"
                    role="listbox"
                    ?disabled="${x => x.disabled}"
                    style="--ni-private-listbox-available-viewport-height: ${x => x.availableViewportHeight}px;"
                    ${ref('listbox')}
                >
                    ${when(x => x.filterMode !== FilterMode.none, html<Select>`
                        <div class="filter-field ${x => x.position || ''}">
                            <${iconMagnifyingGlassTag} class="filter-icon"></${iconMagnifyingGlassTag}>
                            <input
                                ${ref('filterInput')}
                                class="filter-input"
                                aria-controls="${x => x.ariaControls}"
                                aria-activedescendant="${x => x.ariaActiveDescendant}"
                                @input="${(x, c) => x.inputHandler(c.event as InputEvent)}"
                                @click="${(x, c) => x.ignoreClickHandler(c.event as MouseEvent)}"
                                placeholder="${x => filterSearchLabel.getValueFor(x)}"
                                value="${x => x.filter}"
                            />
                        </div>
                    `)}
                    <div ${ref('scrollableRegion')}
                        class="scrollable-region">
                        <slot
                            name="option"
                            ${slotted({
                                filter: (n: Node) => n instanceof HTMLElement && (isListOption(n) || isListOptionGroup(n)),
                                flatten: true,
                                property: 'slottedOptions',
                            })}
                        ></slot>
                        ${when(x => (x.filterMode !== FilterMode.none && x.filteredOptions.length === 0 && !x.loadingVisible), html<Select>`
                            <span class="no-results-label">
                                ${x => filterNoResultsLabel.getValueFor(x)}
                            </span>
                        `)}
                    </div>
                    ${when(x => x.loadingVisible, html<Select>`
                        <div class="loading-container ${x => x.position || ''} ${x => (x.filteredOptions.length === 0 ? 'empty' : '')}"
                            @click="${(x, c) => x.ignoreClickHandler(c.event as MouseEvent)}">
                            <span class="loading-label">
                                ${x => loadingLabel.getValueFor(x)}
                            </span>
                            <${spinnerTag} class="loading-spinner" appearance="accent"></${spinnerTag}>
                        </div>
                    `)}
                </div>
            </div>
        </${anchoredRegionTag}>
    </template>
`;
/* eslint-enable @typescript-eslint/indent */
