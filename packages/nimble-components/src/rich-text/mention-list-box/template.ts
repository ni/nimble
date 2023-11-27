/* eslint-disable */
import {html, ref, slotted } from '@microsoft/fast-element';
import type { RichTextMentionListBox } from '.';
import { Listbox, listboxTag } from '../../listbox';

// prettier-ignore
export const template = html<RichTextMentionListBox>`
  <template>
    <${listboxTag}
            ${ref('listBox')}
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            >
        <slot
          ${slotted({
          filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n),
          flatten: true,
          property: 'slottedOptions',
        })}>
        </slot>
    </${listboxTag}>
  </template>
`;
