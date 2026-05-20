import { html, ref, when } from '@ni/fast-element';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import type { FvSplitButtonAnchor } from '.';

export const template = html<FvSplitButtonAnchor>`
    <div
        class="split-button-container"
        ${ref('splitButtonContainer')}
    >
        ${when(
            x => !x.disabled && x.href.length > 0,
            html<FvSplitButtonAnchor>`
                <a
                    class="split-button-primary"
                    href="${x => x.href}"
                    target="${x => x.target || undefined}"
                    rel="${x => x.rel || undefined}"
                    download="${x => x.download || undefined}"
                    @click="${x => {
                        x.handlePrimaryClick();
                        return true;
                    }}"
                >
                    ${x => x.label}
                </a>
            `
        )}
        ${when(
            x => x.disabled || x.href.length === 0,
            html<FvSplitButtonAnchor>`
                <span
                    class="split-button-primary split-button-primary-disabled"
                    aria-disabled="${x => x.disabled}"
                >
                    ${x => x.label}
                </span>
            `
        )}
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
        html<FvSplitButtonAnchor>`
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