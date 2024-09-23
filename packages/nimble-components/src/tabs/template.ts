import { html, ref, slotted, when } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    startSlotTemplate,
    FoundationElementTemplate,
    TabsOptions
} from '@microsoft/fast-foundation';
import type { Tabs } from '.';
import { buttonTag } from '../button';
import { smallPadding } from '../theme-provider/design-tokens';
import { iconArrowExpanderLeftTag } from '../icons/arrow-expander-left';
import { iconArrowExpanderRightTag } from '../icons/arrow-expander-right';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<Tabs>,
TabsOptions
> = (context, definition) => html`
    <template class="${x => x.orientation}">
        <div
            class="tabsrootcontainer"
            style="
                --ni-private-tabs-container-padding: ${x => (x.showScrollButtons ? smallPadding.getValueFor(x) : '0px')};
            "
        >
            ${startSlotTemplate(context, definition)}
            ${when(x => x.showScrollButtons, html<Tabs>`
                <${buttonTag} 
                    content-hidden
                    class="scroll-button left"
                    appearance="ghost"
                    tabindex="-1"
                    @click="${x => x.onScrollLeftClick()}"
                >
                    <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
                </${buttonTag}>
            `)}
            <div
                class="tablist"
                part="tablist"
                role="tablist"
                ${ref('tabsList')}
            >
                <slot class="tab" name="tab" part="tab" ${slotted('tabs')}>
                </slot>
                ${when(x => x.showActiveIndicator, html<Tabs>`
                    <div
                        ${ref('activeIndicatorRef')}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
            </div>
            ${when(x => x.showScrollButtons, html<Tabs>`
                <${buttonTag}
                    content-hidden
                    class="scroll-button right"
                    appearance="ghost"
                    tabindex="-1"
                    @click="${x => x.onScrollRightClick()}"
                >
                    <${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>
                </${buttonTag}>
            `)}
            ${endSlotTemplate(context, definition)}
        </div>
        <div class="tabpanel" part="tabpanel">
            <slot name="tabpanel" ${slotted('tabpanels')}></slot>
        </div>
    </template>
`;
