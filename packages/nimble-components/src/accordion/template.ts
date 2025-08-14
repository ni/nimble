import { html } from '@ni/fast-element';
import type { ViewTemplate } from '@ni/fast-element';
import type { FoundationElementTemplate } from '@ni/fast-foundation';
import type { Accordion } from '.';

export const template: FoundationElementTemplate<ViewTemplate<Accordion>> = (
    _context,
    _definition
) => html<Accordion>`
    <template class="accordion" role="presentation">
        <slot></slot>
    </template>
`;
