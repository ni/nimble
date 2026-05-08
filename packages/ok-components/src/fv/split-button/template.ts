import { html, ref, when } from '@ni/fast-element';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import type { FvSplitButton } from '.';

export const template = html<FvSplitButton>`
    <div
        class="split-button-container"
        ${ref('splitButtonContainer')}
    >
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
    </div>
    ${when(
        x => x.open,
        html<FvSplitButton>`
            <${anchoredRegionTag}
                fixed-placement
                auto-update-mode="auto"
                horizontal-inset
                horizontal-positioning-mode="dynamic"
                vertical-positioning-mode="locktodefault"
                vertical-default-position="bottom"
                horizontal-scaling="anchor"
                ${ref('region')}
            >
                <span part="menu">
                    <slot name="menu"></slot>
                </span>
            </${anchoredRegionTag}>
        `
    )}
`;