import { children, elements, html, ref, slotted } from '@microsoft/fast-element';
import { Listbox } from '@microsoft/fast-foundation';
import type { MentionBox } from '.';
import { listboxTag } from '../nimble-list-box';

// prettier-ignore
export const template = html<MentionBox>`
    <template
    ${children({ property: 'childItems', filter: elements() })}
    >     
    <${listboxTag}
            ${ref('listBox')} 
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            >    
            <slot
                    ${slotted({
        filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n),
        flatten: true,
        property: 'slottedOptions',
    })}
                ></slot>
    </${listboxTag}>
    </template>
`;
