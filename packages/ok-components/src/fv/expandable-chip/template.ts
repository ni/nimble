import { html, ref } from '@ni/fast-element';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import type { FvExpandableChip } from '.';

export const template = html<FvExpandableChip>`
    <button
        class="expandable-chip"
        part="control"
        type="button"
        ?disabled="${x => x.disabled}"
        ${ref('buttonElement')}
        aria-label="${x => x.accessibleLabel || null}"
        aria-haspopup="dialog"
        aria-expanded="${x => String(x.expanded)}"
        aria-controls="${x => x.controls || null}"
    >
        <span class="label"><slot></slot></span>
        <${iconArrowExpanderDownTag} class="expand-icon" aria-hidden="true"></${iconArrowExpanderDownTag}>
    </button>
`;
