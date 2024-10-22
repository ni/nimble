import { html, ref, slotted, when } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    FoundationElementTemplate,
    TabsOptions
} from '@microsoft/fast-foundation';
import type { Tabs } from '../../tabs';
import { buttonTag } from '../../button';
import { iconArrowExpanderLeftTag } from '../../icons/arrow-expander-left';
import { iconArrowExpanderRightTag } from '../../icons/arrow-expander-right';
import type { TabsOwner } from './types';
import { ButtonAppearance } from '../button/types';
import {
    scrollLeftLabel,
    scrollRightLabel
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
                ${x => scrollLeftLabel.getValueFor(x)}
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
                ${x => scrollRightLabel.getValueFor(x)}
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
