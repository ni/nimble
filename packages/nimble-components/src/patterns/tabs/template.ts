import { html, ref, slotted, when } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    FoundationElementTemplate,
    TabsOptions
} from '@microsoft/fast-foundation';
import type { Tabs } from '../../tabs';
import type { AnchorTabs } from '../../anchor-tabs';
import { buttonTag } from '../../button';
import { iconArrowExpanderLeftTag } from '../../icons/arrow-expander-left';
import { iconArrowExpanderRightTag } from '../../icons/arrow-expander-right';

type TabsOrAnchorTabs = Tabs | AnchorTabs;

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<TabsOrAnchorTabs>,
TabsOptions
> = (context, definition) => html`
    <template>
        <div
            class="tab-bar"
        >
            ${startSlotTemplate(context, definition)}
            ${when(x => x.showScrollButtons, html<Tabs>`
                <${buttonTag} 
                    content-hidden
                    class="scroll-button left"
                    appearance="ghost"
                    tabindex="-1"
                    aria-hidden="true"
                    @click="${x => x.onScrollLeftClick()}"
                    ${ref('leftScrollButton')}
                >
                    <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
                </${buttonTag}>
            `)}
            <div
                class="tablist"
                part="tablist"
                role="tablist"
                ${ref('tablist')}
            >
                <slot class="tab" name="tab" part="tab" ${slotted('tabs')}>
                </slot>
            </div>
            ${when(x => x.showScrollButtons, html<Tabs>`
                <${buttonTag}
                    content-hidden
                    class="scroll-button right"
                    appearance="ghost"
                    tabindex="-1"
                    aria-hidden="true"
                    @click="${x => x.onScrollRightClick()}"
                >
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
    </template>
`;
