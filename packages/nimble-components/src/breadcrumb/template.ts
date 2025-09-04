import { elements, html, ref, slotted, when } from '@ni/fast-element';
import type { ViewTemplate } from '@ni/fast-element';
import type { FoundationElementTemplate } from '@ni/fast-foundation';
import type { Breadcrumb } from '.';
import { buttonTag } from '../button';
import { ButtonAppearance } from '../button/types';
import { scrollBackwardLabel, scrollForwardLabel } from '../label-provider/core/label-tokens';
import { iconArrowExpanderLeftTag } from '../icons/arrow-expander-left';
import { iconArrowExpanderRightTag } from '../icons/arrow-expander-right';

/**
 * The template for the {@link @ni/fast-foundation#Breadcrumb} component.
 * @public
 */
export const breadcrumbTemplate: FoundationElementTemplate<ViewTemplate<Breadcrumb>> = (
    _context,
    _definition
) => html`
    <template role="navigation">
        ${when(x => x.showScrollButtons, html<Breadcrumb>`
            <${buttonTag} 
                content-hidden
                class="scroll-button left"
                appearance="${ButtonAppearance.ghost}"
                @click="${x => x.onScrollLeftClick()}"
                ${ref('leftScrollButton')}
            >
                ${x => scrollForwardLabel.getValueFor(x)}
                <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
            </${buttonTag}>
        `)}
        <div ${ref('list')} role="list" class="list" part="list">
            <slot ${slotted({ property: 'slottedBreadcrumbItems', filter: elements() })}></slot>
        </div>
        ${when(x => x.showScrollButtons, html<Breadcrumb>`
            <${buttonTag}
                content-hidden
                class="scroll-button right"
                appearance="${ButtonAppearance.ghost}"
                @click="${x => x.onScrollRightClick()}"
            >
                ${x => scrollBackwardLabel.getValueFor(x)}
                <${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>
            </${buttonTag}>
        `)}
    </template>
`;
