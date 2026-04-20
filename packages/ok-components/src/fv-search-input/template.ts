import { html, ref, when } from '@ni/fast-element';
import { iconMagnifyingGlassTag } from '@ni/nimble-components/dist/esm/icons/magnifying-glass';
import { iconTimesTag } from '@ni/nimble-components/dist/esm/icons/times';
import type { FvSearchInput } from '.';

export const template = html<FvSearchInput>`
    <div class="search-input-container">
        <span class="search-input-icon" aria-hidden="true">
            <${iconMagnifyingGlassTag}></${iconMagnifyingGlassTag}>
        </span>
        <input
            class="search-input"
            part="control"
            id="control"
            type="text"
            ?autofocus="${x => x.autofocus}"
            ?disabled="${x => x.disabled}"
            aria-label="${x => x.ariaLabel}"
            aria-labelledby="${x => x.ariaLabelledby}"
            placeholder="${x => x.placeholder}"
            :value="${x => x.value}"
            ?readonly="${x => x.readOnly}"
            @input="${x => x.handleTextInput()}"
            @change="${x => x.handleChange()}"
            ${ref('control')}
        />
        ${when(
            x => x.value.length > 0,
            html<FvSearchInput>`
                <button
                    class="search-input-clear"
                    type="button"
                    aria-label="Clear search"
                    @click="${x => x.clear()}"
                >
                    <${iconTimesTag}></${iconTimesTag}>
                </button>
            `
        )}
    </div>
`;