import { html, ref, repeat, when } from '@ni/fast-element';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import { checkboxTag } from '@ni/nimble-components/dist/esm/checkbox';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { iconMagnifyingGlassTag } from '@ni/nimble-components/dist/esm/icons/magnifying-glass';
import { iconTimesTag } from '@ni/nimble-components/dist/esm/icons/times';
import { filterNoResultsLabel, filterSearchLabel } from '@ni/nimble-components/dist/esm/label-provider/core/label-tokens';
import type { FvMultiSelect } from '.';
import type { FvMultiSelectOption } from './types';

export const template = html<FvMultiSelect>`
    <template
        @focusout="${(x, c) => x.handleFocusout(c.event as FocusEvent)}"
        @click="${(x, c) => {
            if (c.event.composedPath()[0] === x && !x.effectiveDisabled) {
                x.control.focus();
            }
            return true;
        }}"
    >
        ${when(x => x.label.length > 0, html<FvMultiSelect>`
            <label class="label" id="${x => `${x.controlId}-label`}" for="${x => x.controlId}">${x => x.label}</label>
        `)}
        <div ${ref('controlField')} class="control-field"
            @keypress="${(_, c) => {
                c.event.stopPropagation();
                return true;
            }}"
            @click="${x => {
                x.keyboardNavigation = false;
                x.open = !x.open;
            }}">
            <button
                ${ref('control')}
                id="${x => x.controlId}"
                class="control"
                part="control"
                type="button"
                ?disabled="${x => x.effectiveDisabled}"
                aria-labelledby="${x => `${x.label ? `${x.controlId}-label ` : ''}${x.controlId}-value`}"
                aria-haspopup="listbox"
                aria-expanded="${x => x.open}"
                aria-controls="${x => x.listboxId}"
                @keydown="${(x, c) => x.handleControlKeydown(c.event as KeyboardEvent)}"
            >
                <span class="selected-value ${x => (x.selectedValues.length === 0 ? 'placeholder' : '')}"
                    id="${x => `${x.controlId}-value`}"
                    part="selected-value" title="${x => x.displayValue || null}">
                    ${x => x.displayValue || x.placeholder}
                </span>
            </button>
            ${when(x => x.clearable && !x.effectiveDisabled && x.selectedValues.length > 0, html<FvMultiSelect>`
                <${buttonTag}
                    class="clear-button"
                    part="clear-button"
                    tabindex="-1"
                    appearance="ghost"
                    content-hidden
                    aria-label="Clear selection"
                    @click="${(x, c) => {
                        c.event.stopPropagation();
                        x.clearSelection();
                    }}"
                >
                    <${iconTimesTag} slot="start"></${iconTimesTag}>
                </${buttonTag}>
            `)}
            <${iconArrowExpanderDownTag} aria-hidden="true"></${iconArrowExpanderDownTag}>
        </div>
        <${anchoredRegionTag}
            ${ref('region')}
            class="anchored-region"
            fixed-placement
            auto-update-mode="auto"
            vertical-default-position="bottom"
            vertical-positioning-mode="dynamic"
            horizontal-default-position="center"
            horizontal-positioning-mode="locktodefault"
            horizontal-scaling="anchor"
            ?hidden="${x => !x.open}"
            @loaded="${x => x.focusPopup()}"
        >
            <div class="popup ${x => (x.keyboardNavigation ? 'keyboard-navigation' : '')}"
                @keypress="${(_, c) => {
                    c.event.stopPropagation();
                    return true;
                }}"
                @pointerdown="${x => {
                    x.keyboardNavigation = false;
                    return true;
                }}"
                @keydown="${(x, c) => x.handlePopupKeydown(c.event as KeyboardEvent)}">
                ${when(x => x.filterable, html<FvMultiSelect>`
                    <div class="filter-field">
                        <${iconMagnifyingGlassTag} class="filter-icon" aria-hidden="true"></${iconMagnifyingGlassTag}>
                        <input
                            ${ref('filterInput')}
                            class="filter-input"
                            type="text"
                            role="combobox"
                            autocomplete="off"
                            aria-autocomplete="list"
                            aria-expanded="${x => x.open}"
                            aria-controls="${x => x.listboxId}"
                            aria-activedescendant="${x => x.activeOptionId}"
                            aria-label="${x => filterSearchLabel.getValueFor(x)}"
                            placeholder="${x => filterSearchLabel.getValueFor(x)}"
                            :value="${x => x.filter}"
                            @input="${(x, c) => {
                                x.handleInput(c.event);
                                return true;
                            }}"
                            @change="${(_, c) => {
                                c.event.stopPropagation();
                                return true;
                            }}"
                        />
                    </div>
                `)}
                <div ${ref('listbox')}
                    id="${x => x.listboxId}"
                    class="listbox"
                    part="listbox"
                    role="listbox"
                    aria-label="${x => x.label || x.placeholder || null}"
                    aria-multiselectable="true"
                    aria-required="${x => x.required}"
                    aria-activedescendant="${x => (!x.filterable ? x.activeOptionId : null)}"
                    tabindex="${x => (x.filterable ? '-1' : '0')}"
                >
                    ${repeat(x => x.visibleOptions, html<FvMultiSelectOption, FvMultiSelect>`
                        <div
                            id="${(_, c) => `${c.parent.listboxId}-${c.index}`}"
                            class="option ${(_, c) => (c.parent.activeIndex === c.index ? 'active' : '')}"
                            part="option"
                            role="option"
                            aria-selected="${(x, c) => c.parent.selectedValues.includes(x.value)}"
                            aria-disabled="${x => !!x.disabled}"
                            @mousedown="${() => false}"
                            @click="${(x, c) => {
                                if (!x.disabled) {
                                    c.parent.keyboardNavigation = false;
                                    c.parent.activeIndex = c.index;
                                    c.parent.toggleOption(x);
                                }
                            }}"
                        >
                            <${checkboxTag}
                                inert
                                aria-hidden="true"
                                tabindex="-1"
                                :checked="${(x, c) => c.parent.selectedValues.includes(x.value)}"
                                ?disabled="${x => !!x.disabled}"
                                @change="${(_, c) => {
                                    c.event.stopPropagation();
                                    return true;
                                }}"
                            ></${checkboxTag}>
                            <span class="option-label" title="${x => x.label}">${x => x.label}</span>
                        </div>
                    `, { positioning: true })}
                </div>
                ${when(x => x.visibleOptions.length === 0, html<FvMultiSelect>`
                    <div class="empty" role="status">${x => filterNoResultsLabel.getValueFor(x)}</div>
                `)}
            </div>
        </${anchoredRegionTag}>
    </template>
`;
