import { html, slotted, ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    FoundationElementTemplate,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import type { AnchorTabs, TabsOptions } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<AnchorTabs>,
TabsOptions
> = (context, definition) => html<AnchorTabs>`
    ${startSlotTemplate(context, definition)}
    <div class="tablist" part="tablist" role="tablist">
        <slot name="anchortab" ${slotted('tabs')}></slot>
    </div>
    ${endSlotTemplate(context, definition)}
`;
