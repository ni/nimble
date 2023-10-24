import { children, elements, html, ref, repeat } from '@microsoft/fast-element';
import type { MentionBox } from '.';
import { ListOption, listOptionTag } from '../../../list-option';
import { listBoxTag } from '../mention-popup copy';

// prettier-ignore
export const template = html<MentionBox>`
    <template
    ${children({ property: 'childItems', filter: elements() })}
    >     
    <${listBoxTag}
            ${ref('listBox')} 
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            >    
            ${repeat(x => x.filteredOptions, html<ListOption>`
                    <${listOptionTag} value="${x => x.value}">${x => x.textContent}</${listOptionTag}>
                    `)}
    </${listBoxTag}>
    </template>
`;
