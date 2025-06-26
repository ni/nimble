import { html, ref, slotted, when } from '@ni/fast-element';
import type { ViewTemplate } from '@ni/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    type FoundationElementTemplate,
    type TabsOptions
} from '@ni/fast-foundation';
import type { Tabs } from '../../tabs';
import { buttonTag } from '../../button';
import { iconArrowExpanderLeftTag } from '../../icons/arrow-expander-left';
import { iconArrowExpanderRightTag } from '../../icons/arrow-expander-right';
import type { TabsOwner } from './types';
import { ButtonAppearance } from '../button/types';
import {
    scrollForwardLabel,
    scrollBackwardLabel
} from '../../label-provider/core/label-tokens';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<TabsOwner>,
TabsOptions
> = (context, definition) => html`
    <div
        class="tab-bar"
    >
        ${startSlotTemplate(context, definition)}
        ${when(x => x.showScrollButtons, html<TabsOwner>`
            <${buttonTag} 
                content-hidden
                class="scroll-button left"
                appearance="${ButtonAppearance.ghost}"
                tabindex="-1"
                @click="${x => x.onScrollLeftClick()}"
                ${ref('leftScrollButton')}
            >
                ${x => scrollForwardLabel.getValueFor(x)}
                <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
            </${buttonTag}>
        `)}
        <div
            class="tablist"
            part="tablist"
            role="tablist"
            ${ref('tablist')}
        >
            <slot class="tab" name="${x => x.tabSlotName}" part="tab" ${slotted('tabs')}>
            </slot>
        </div>
        ${when(x => x.showScrollButtons, html<TabsOwner>`
            <${buttonTag}
                content-hidden
                class="scroll-button right"
                appearance="${ButtonAppearance.ghost}"
                tabindex="-1"
                @click="${x => x.onScrollRightClick()}"
            >
                ${x => scrollBackwardLabel.getValueFor(x)}
                <${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>
            </${buttonTag}>
        `)}
        ${endSlotTemplate(context, definition)}
    </div>
    ${when(x => 'tabpanels' in x, html<Tabs>`
        <div class="tabpanel" part="tabpanel">
            <slot name="tabpanel" ${slotted('tabpanels')}></slot>
        </div>
    `)}
`;
