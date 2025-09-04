import { elements, html, slotted } from '@ni/fast-element';
import type { ViewTemplate } from '@ni/fast-element';
import type { FoundationElementTemplate } from '@ni/fast-foundation';
import type { Breadcrumb } from '.';

/**
 * The template for the {@link @ni/fast-foundation#Breadcrumb} component.
 * @public
 */
export const breadcrumbTemplate: FoundationElementTemplate<ViewTemplate<Breadcrumb>> = (
    _context,
    _definition
) => html`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot ${slotted({ property: 'slottedBreadcrumbItems', filter: elements() })}></slot>
        </div>
    </template>
`;
