import { html, ref, ViewTemplate } from '@microsoft/fast-element';
import {
    AnchorOptions,
    endSlotTemplate,
    FoundationElementTemplate,
    startSlotTemplate
} from '@microsoft/fast-foundation';
import type { AnchorTreeItem } from '.';

export const template: FoundationElementTemplate<
ViewTemplate<AnchorTreeItem>,
AnchorOptions
> = (context, definition) => html<AnchorTreeItem>`
    <template
        role="treeitem"
        slot="${x => (x.isNestedItem() ? 'item' : null)}"
        tabindex="-1"
        aria-disabled="${x => x.disabled}"
        aria-selected="${x => x.selected}"
        @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        <a
            class="control"
            part="control"
            tabindex="0"
            download="${x => x.download}"
            href=${x => (x.disabled ? null : x.href)}
            hreflang="${x => x.hreflang}"
            ping="${x => x.ping}"
            referrerpolicy="${x => x.referrerpolicy}"
            rel="${x => x.rel}"
            target="${x => x.target}"
            type="${x => x.type}"
            ${ref('control')}
        >
            <div class="positioning-region" part="positioning-region">
                <div class="content-region" part="content-region">
                    ${startSlotTemplate(context, definition)}
                    <span class="content" part="content">
                        <slot></slot>
                    </span>
                    ${endSlotTemplate(context, definition)}
                </div>
            </div>
        </a>
    </template>
`;
