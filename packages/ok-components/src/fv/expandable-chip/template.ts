import { html, ref, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { iconTimesTag } from '@ni/nimble-components/dist/esm/icons/times';
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
    ${when(x => x.removable && !x.disabled, html<FvExpandableChip>`
        <${buttonTag}
            class="remove-button"
            content-hidden
            appearance="${ButtonAppearance.ghost}"
            @click="${(x, c) => x.handleRemoveClick(c.event)}"
        >
            <${iconTimesTag} slot="start"></${iconTimesTag}>
            ${x => x.removeButtonContent}
        </${buttonTag}>
    `)}
`;
