import { html, when } from '@ni/fast-element';
import { iconMagnifyingGlassTag } from '@ni/nimble-components/dist/esm/icons/magnifying-glass';
import { iconTimesTag } from '@ni/nimble-components/dist/esm/icons/times';
import type { SearchInput } from '.';

export const template = html<SearchInput>`
    <div class="search-input-container">
        <span class="search-input-icon" aria-hidden="true">
            <${iconMagnifyingGlassTag}></${iconMagnifyingGlassTag}>
        </span>
        <input
            class="search-input"
            type="text"
            placeholder="${x => x.placeholder}"
            :value="${x => x.value}"
            @input="${(x, c) => x.handleInput(c.event)}"
            @change="${(x, c) => x.handleChange(c.event)}"
        />
        ${when(
            x => x.value.length > 0,
            html<SearchInput>`
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