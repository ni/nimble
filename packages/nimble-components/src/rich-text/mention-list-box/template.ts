/* eslint-disable */
import { children, elements, html, ref, repeat } from '@microsoft/fast-element';
import type { RichTextMentionListBox } from '.';
import { Listbox, listboxTag } from '../../listbox';
import { anchoredRegionTag } from '../../anchored-region';
import type { MappingConfig } from '../../rich-text-mention/base/models/mapping-config';
import { listOptionTag } from '../../list-option';

// prettier-ignore
export const template = html<RichTextMentionListBox>`
  <template ?hidden="${x => !x.open}">
    <${anchoredRegionTag}
            ${ref('region')}
            class="anchored-region"
            auto-update-mode="auto"
            vertical-positioning-mode="locktodefault"
            horizontal-positioning-mode="locktodefault"
            vertical-default-position="bottom"
            >
            <${listboxTag}
                ${ref('listBox')}
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
                ${children({ property: 'childItems', filter: elements() })}
                >
                ${repeat(
                    x => Array.from(x.activeMappingConfigs?.values() ?? []),
                    html<MappingConfig>`<${listOptionTag} value="${x => x.mentionHref}">${x => x.displayName}</${listOptionTag}>`,{ recycle: false }
                )}
            </${listboxTag}>
        </${anchoredRegionTag}>
    </template>
`;
