import { html } from '@ni/fast-element';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import type { FvSplitButton } from '.';

export const template = html<FvSplitButton>`
    <div class="split-button-container">
        <button
            class="split-button-primary"
            type="button"
            ?disabled="${x => x.disabled}"
            @click="${x => {
                x.handlePrimaryClick();
                return true;
            }}"
        >
            ${x => x.label}
        </button>
        <button
            class="split-button-toggle"
            type="button"
            ?disabled="${x => x.disabled}"
            aria-label="${x => `More actions for ${x.label}`}"
            aria-expanded="${x => x.open}"
            aria-haspopup="menu"
            @click="${x => {
                x.handleToggleClick();
                return true;
            }}"
        >
            <${iconArrowExpanderDownTag}></${iconArrowExpanderDownTag}>
        </button>
        <div
            class="split-button-menu"
            ?hidden="${x => !x.open}"
            @change="${x => {
                x.handleMenuChange();
                return true;
            }}"
        >
            <slot name="menu"></slot>
        </div>
    </div>
`;