import { children, elements, html, ref, slotted } from '@microsoft/fast-element';
import { Listbox } from '@microsoft/fast-foundation';
import type { MentionBox } from '.';
import { listBoxTag } from '../nimble-list-box';

// prettier-ignore
export const template = html<MentionBox>`
    <template
    ${children({ property: 'childItems', filter: elements() })}
    >     
    <${listBoxTag}
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
    </${listBoxTag}>
    </template>
`;
