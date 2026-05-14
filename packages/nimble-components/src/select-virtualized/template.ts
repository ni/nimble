import { html, ref, repeat, ViewTemplate, when } from '@ni/fast-element';
import {
    endSlotTemplate,
    type FoundationElementTemplate,
    type SelectOptions,
    startSlotTemplate
} from '@ni/fast-foundation';
import type { SelectVirtualized } from '.';
import { anchoredRegionTag } from '../anchored-region';
import { DropdownPosition } from '../patterns/dropdown/types';
import { overflow } from '../utilities/directive/overflow';
import { iconMagnifyingGlassTag } from '../icons/magnifying-glass';
import {
    filterNoResultsLabel,
    filterSearchLabel,
    loadingLabel
} from '../label-provider/core/label-tokens';
import { FilterMode, type SelectVirtualizedOption } from './types';
import { buttonTag } from '../button';
import { iconTimesTag } from '../icons/times';
import { listOptionTag } from '../list-option';
import { spinnerTag } from '../spinner';
import { createRequiredVisibleLabelTemplate } from '../patterns/required-visible/template';

const labelTemplate = createRequiredVisibleLabelTemplate(html<SelectVirtualized>`
    <label part="label" class="label" aria-hidden="true">
        <slot ${ref('labelSlot')}></slot>
    </label>
`);

export const template: FoundationElementTemplate<
ViewTemplate<SelectVirtualized>,
SelectOptions
> = (context, definition) => html<SelectVirtualized>`
    <template
        class="${x => [
                'collapsible',
                x.open && 'open',
                x.disabled && 'disabled',
                x.position,
            ].filter(Boolean).join(' ')}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-expanded="${x => x.ariaExpanded}"
        aria-haspopup="listbox"
        aria-label="${x => x.labelContent}"
        aria-multiselectable="${x => x.ariaMultiSelectable}"
        aria-required="${x => x.requiredVisible}"
        ?open="${x => x.open}"
        role="combobox"
        tabindex="${x => (!x.disabled ? '0' : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @contentchange="${x => x.updateDisplayValue()}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event as MouseEvent)}"
    >
        ${labelTemplate}
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
                ${when(x => !x.disabled && x.clearable && !x.displayPlaceholder && x.selectedIndex >= 0, html<SelectVirtualized>`
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
                        ${definition.indicator ?? ''}
                    </slot>
                </div>
            </slot>
            ${endSlotTemplate(context, definition)}
        </div>
        <${anchoredRegionTag}
            ${ref('anchoredRegion')}
            class="anchored-region"
            fixed-placement
            auto-update-mode="auto"
            vertical-default-position="${x => (x.positionAttribute === DropdownPosition.above ? 'top' : 'bottom')}"
            vertical-positioning-mode="${x => (!x.positionAttribute ? 'dynamic' : 'locktodefault')}"
            horizontal-default-position="center"
            horizontal-positioning-mode="locktodefault"
            horizontal-scaling="anchor"
            @loaded="${x => x.regionLoadedHandler()}"
            ?hidden="${x => !x.open}">
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
                    style="--ni-private-listbox-available-viewport-height: ${x => x.availableViewportHeight}px;"
                    ${ref('listbox')}
                >
                    ${when(x => x.filterMode !== FilterMode.none, html<SelectVirtualized>`
                        <div class="filter-field ${x => x.positionAttribute}">
                            <${iconMagnifyingGlassTag} class="filter-icon"></${iconMagnifyingGlassTag}>
                            <input
                                ${ref('filterInput')}
                                class="filter-input"
                                @input="${(x, c) => x.inputHandler(c.event as InputEvent)}"
                                @click="${(x, c) => x.ignoreClickHandler(c.event as MouseEvent)}"
                                placeholder="${x => filterSearchLabel.getValueFor(x)}"
                                value="${x => x.filter}"
                            />
                        </div>
                    `)}
                    <div ${ref('scrollableRegion')}
                        class="scrollable-region">
                        ${repeat(x => x.filteredOptions, html<SelectVirtualizedOption, SelectVirtualized>`
                            <${listOptionTag} value="${o => o.value}" disabled="${o => o.disabled}" selected="${(_, c) => c.parent.selectedIndex === c.index}">
                                <span>${x => x.displayText}</span>
                            </${listOptionTag}>
                        `)}
                        ${when(x => (x.filterMode !== FilterMode.none && x.filteredOptions.length === 0 && !x.loadingVisible), html<SelectVirtualized>`
                            <span class="no-results-label">
                                ${x => filterNoResultsLabel.getValueFor(x)}
                            </span>
                        `)}
                    </div>
                    ${when(x => x.loadingVisible, html<SelectVirtualized>`
                        <div class="loading-container ${x => x.positionAttribute} ${x => (x.filteredOptions.length === 0 ? 'empty' : '')}"
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
