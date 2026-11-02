import { html, repeat, when } from '@ni/fast-element';
import { iconFilterTag } from '@ni/nimble-components/dist/esm/icons/filter';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import type { FvFilterBar } from '.';
import type { FvFilterBarToken } from './types';

const queryTokenTemplate = html<FvFilterBarToken>`${when(
        x => x.kind === 'predicate',
        html<FvFilterBarToken>`<span class="query-expression"><b>${x => (x.kind === 'predicate' ? x.field : '')}</b> ${x => (x.kind === 'predicate' ? x.operator : '')}<b>${x => (x.kind === 'predicate' ? x.value : '')}</b></span>`
    )}${when(
        x => x.kind === 'logic',
        html<FvFilterBarToken>`<span class="logical-operator">${x => (x.kind === 'logic' ? x.text : '')}</span>`
    )}${when(
        x => x.kind === 'group',
        html<FvFilterBarToken>`<span class="compound-expression-container">${x => (x.kind === 'group' ? x.text : '')}</span>`
    )}`;

export const template = html<FvFilterBar>`
    <div class="filter-bar" role="group" aria-label="${x => x.label}">
        <button
            class="filter-bar-edit"
            type="button"
            aria-label="${x => `Edit filters: ${x.label}`}"
            title="${x => x.expression}"
            ?disabled="${x => x.disabled}"
            @click="${x => x.handleEditClick()}"
        >
            <${iconFilterTag} class="filter-bar-icon" aria-hidden="true"></${iconFilterTag}>
            <span class="filter-bar-content">
                <span class="filter-bar-label">${x => x.label}</span>${when(
                    x => x.expression.length > 0,
                    html<FvFilterBar>`<span class="filter-bar-expression">${repeat(x => x.queryTokens, queryTokenTemplate)}</span>`
                )}
            </span>
        </button>
        ${when(
            x => x.showClearButton && x.expression.length > 0,
            html<FvFilterBar>`
                <button
                    class="filter-bar-clear"
                    type="button"
                    aria-label="Clear filters"
                    ?disabled="${x => x.disabled}"
                    @click="${x => x.handleClearClick()}"
                >
                    <${iconXmarkTag} class="filter-bar-icon" aria-hidden="true"></${iconXmarkTag}>
                </button>
            `
        )}
    </div>
`;
