import {
    html,
    ref,
    slotted,
    ViewTemplate,
    when
} from '@microsoft/fast-element';
import {
    endSlotTemplate,
    FoundationElementTemplate,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import type { AnchorTabs, TabsOptions } from '.';
import { buttonTag } from '../button';
import { iconArrowExpanderRightTag } from '../icons/arrow-expander-right';
import { iconArrowExpanderLeftTag } from '../icons/arrow-expander-left';
import { smallPadding } from '../theme-provider/design-tokens';

// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<AnchorTabs>,
TabsOptions
> = (context, definition) => html<AnchorTabs>`
    <template>
        <div
            class="tabsrootcontainer"
            style="
                --ni-private-tabs-container-padding: ${x => (x.showScrollButtons ? smallPadding.getValueFor(x) : '0px')};
            "
        >
            ${startSlotTemplate(context, definition)}
            ${when(x => x.showScrollButtons, html<AnchorTabs>`
                <${buttonTag} 
                    content-hidden
                    class="scroll-button left"
                    appearance="ghost"
                    tabindex="-1"
                    @click="${x => x.onScrollLeftClick()}"
                    ${ref('leftScrollButton')}
                >
                    <${iconArrowExpanderLeftTag} slot="start"></${iconArrowExpanderLeftTag}>
                </${buttonTag}>
            `)}
            <div
                ${ref('tablist')}
                class="tablist"
                part="tablist"
                role="tablist"
            >
                <slot name="anchortab" ${slotted('tabs')}></slot>
            </div>
            ${when(x => x.showScrollButtons, html<AnchorTabs>`
                <${buttonTag}
                    content-hidden
                    class="scroll-button right"
                    appearance="ghost"
                    tabindex="-1"
                    @click="${x => x.onScrollRightClick()}"
                    ${ref('rightScrollButton')}
                >
                    <${iconArrowExpanderRightTag} slot="start"></${iconArrowExpanderRightTag}>
                </${buttonTag}>
            `)}
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;
