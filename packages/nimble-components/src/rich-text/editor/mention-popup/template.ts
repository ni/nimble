import { html, slotted } from '@microsoft/fast-element';
import { Listbox } from '@microsoft/fast-foundation';
import type { MentionBox } from '.';

// prettier-ignore
export const template = html<MentionBox>`
    <template
    >     
            <div
                class="listbox"
                part="listbox"
                role="listbox"
                @click= "${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            >
            <slot
            ${slotted({
        filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n),
        flatten: true,
        property: 'slottedOptions',
    })}
                ></slot>
            </div>
    </template>
`;
