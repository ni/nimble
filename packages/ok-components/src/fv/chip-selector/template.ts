import { html, ref, repeat, when } from '@ni/fast-element';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { ChipAppearance } from '@ni/nimble-components/dist/esm/chip/types';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { toggleButtonTag } from '@ni/nimble-components/dist/esm/toggle-button';
import type { FvChipSelector } from '.';

export const template = html<FvChipSelector>`
    <div class="chip-selector">
        ${when(
            x => x.label.length > 0,
            html<FvChipSelector>`
                <label id="${x => x.labelId}" class="label" for="${x => x.inputId}">
                    ${x => x.label}
                </label>
            `
        )}
        <div
            class="chip-selector-field"
            role="combobox"
            aria-expanded="${x => x.open}"
            aria-controls="${x => x.menuId}"
            aria-haspopup="listbox"
            aria-disabled="${x => x.disabled}"
            aria-labelledby="${x => (x.label.length > 0 ? x.labelId : null)}"
            ${ref('field')}
            @click="${(x, c) => {
                x.handleFieldClick(c.event);
                return true;
            }}"
        >
            <div class="chip-selector-selection-area">
                ${repeat(
                    x => x.selectedValueList,
                    html<string, FvChipSelector>`
                        <${chipTag}
                            removable
                            appearance="${ChipAppearance.block}"
                            data-chip-value="${x => x}"
                            ?disabled="${(_, c) => c.parent.disabled}"
                            @remove="${(_, c) => {
                                c.parent.handleChipRemove(c.event);
                                return true;
                            }}"
                        >
                            ${x => x}
                        </${chipTag}>
                    `
                )}
                <input
                    id="${x => x.inputId}"
                    class="chip-selector-input"
                    type="text"
                    autocomplete="off"
                    spellcheck="false"
                    placeholder="${x => (x.selectedValueList.length === 0 ? x.placeholder : '')}"
                    :value="${x => x.filterText}"
                    aria-controls="${x => x.menuId}"
                    aria-activedescendant="${x => (x.open ? x.activeOptionId : null)}"
                    aria-autocomplete="list"
                    aria-expanded="${x => x.open}"
                    aria-label="${x => (x.label.length === 0 ? x.placeholder || 'Chip selector' : null)}"
                    aria-labelledby="${x => (x.label.length > 0 ? x.labelId : null)}"
                    aria-haspopup="listbox"
                    role="combobox"
                    ?disabled="${x => x.disabled}"
                    ${ref('captureInputRef')}
                    @focus="${x => {
                        x.handleInputFocus();
                        return true;
                    }}"
                    @input="${(x, c) => {
                        x.handleInput(c.event);
                        return true;
                    }}"
                    @keydown="${(x, c) => x.handleInputKeydown(c.event as KeyboardEvent)}"
                />
            </div>
            <${toggleButtonTag}
                class="chip-selector-menu-button"
                appearance="ghost"
                :checked="${x => x.open}"
                ?disabled="${x => x.disabled}"
                ${ref('captureMenuButtonRef')}
                @click="${(x, c) => {
                    x.handleMenuButtonClick(c.event);
                    return true;
                }}"
                @change="${(x, c) => {
                    x.handleMenuButtonChange(c.event);
                    return true;
                }}"
                content-hidden="true"
                aria-hidden="true"
                tabindex="-1"
            >
                <${iconArrowExpanderDownTag} slot="start" class="chip-selector-menu-icon"></${iconArrowExpanderDownTag}>
            </${toggleButtonTag}>
        </div>
        ${when(
            x => x.open,
            html<FvChipSelector>`
                <${anchoredRegionTag}
                    class="chip-selector-anchored-region"
                    ${ref('region')}
                    fixed-placement
                    auto-update-mode="auto"
                    vertical-default-position="bottom"
                    vertical-positioning-mode="locktodefault"
                    horizontal-default-position="center"
                    horizontal-positioning-mode="locktodefault"
                    horizontal-scaling="anchor"
                >
                    <div @click="${(x, c) => {
                            x.handleMenuClick(c.event);
                            return true;
                        }}"
                    >
                        <${menuTag}
                            id="${x => x.menuId}"
                            class="chip-selector-menu"
                            @change="${(_, c) => {
                                c.event.stopPropagation();
                                return true;
                            }}"
                        >
                            ${repeat(
                                x => x.visibleOptionList,
                                html<string, FvChipSelector>`
                                    <${menuItemTag}
                                        id="${(_, c) => `${c.parent.menuId}-option-${c.index}`}"
                                        class="chip-selector-option"
                                        data-option-value="${x => x}"
                                    >
                                        ${x => x}
                                    </${menuItemTag}>
                                `
                            )}
                            ${when(
                                x => x.customValueCandidate.length > 0,
                                html<FvChipSelector>`
                                    <${menuItemTag}
                                        id="${x => `${x.menuId}-option-create`}"
                                        class="chip-selector-option chip-selector-create-option"
                                        data-option-value="${x => x.customValueCandidate}"
                                    >
                                        ${x => x.createOptionLabel}
                                    </${menuItemTag}>
                                `
                            )}
                            ${when(
                                x => x.showEmptyState,
                                html<FvChipSelector>`
                                    <div class="chip-selector-empty">No matches</div>
                                `
                            )}
                        </${menuTag}>
                    </div>
                </${anchoredRegionTag}>
            `
        )}
    </div>
`;