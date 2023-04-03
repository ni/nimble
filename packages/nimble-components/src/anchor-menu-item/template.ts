import { html, ref, ViewTemplate } from '@microsoft/fast-element';
import {
    AnchorOptions,
    endSlotTemplate,
    FoundationElementTemplate,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import type { AnchorMenuItem } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<AnchorMenuItem>,
AnchorOptions
> = (context, definition) => html<AnchorMenuItem>`
    <template
        role="menuitem"
        class="${x => (typeof x.startColumnCount === 'number'
        ? `indent-${x.startColumnCount}`
        : '')}"
        aria-disabled="${x => x.disabled}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    >
        <a
            ${ref('anchor')}
            download="${x => x.download}"
            href=${x => (x.disabled ? null : x.href)}
            hreflang="${x => x.hreflang}"
            ping="${x => x.ping}"
            referrerpolicy="${x => x.referrerpolicy}"
            rel="${x => x.rel}"
            target="${x => x.target}"
            type="${x => x.type}"
        >
            ${startSlotTemplate(context, definition)}
            <span class="content" part="content">
                <slot></slot>
            </span>
            ${endSlotTemplate(context, definition)}
        </a>
    </template>
`;
