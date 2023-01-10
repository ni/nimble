import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    endSlotTemplate,
    FoundationElementTemplate,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import type { AnchorTab, TabOptions } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<AnchorTab>,
TabOptions
> = (context, definition) => html<AnchorTab>`
    <template slot="anchortab" role="tab" aria-disabled="${x => x.disabled}">
        ${startSlotTemplate(context, definition)}
        <a
            download="${x => x.download}"
            href=${x => (x.disabled ? null : x.href)}
            hreflang="${x => x.hreflang}"
            ping="${x => x.ping}"
            referrerpolicy="${x => x.referrerpolicy}"
            rel="${x => x.rel}"
            target="${x => x.target}"
            type="${x => x.type}"
            tabindex="-1">
            <slot></slot>
        </a>
        ${endSlotTemplate(context, definition)}
    </template>
`;
