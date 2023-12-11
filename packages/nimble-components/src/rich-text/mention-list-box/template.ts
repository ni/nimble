import { html, ref, slotted } from '@microsoft/fast-element';
import type { RichTextMentionListBox } from '.';
import { Listbox } from '../../listbox';
import { anchoredRegionTag } from '../../anchored-region';

// prettier-ignore
export const template = html<RichTextMentionListBox>`
    <template>
        <${anchoredRegionTag}
            ${ref('region')}
            class="anchored-region"
            fixed-placement
            auto-update-mode="auto"
            vertical-default-position="'bottom'"
            vertical-positioning-mode="'locktodefault'"
            horizontal-default-position="center"
            horizontal-positioning-mode="locktodefault"
            horizontal-scaling="anchor"
            ?hidden="${x => !x.open}">
            <div
                class="listbox"
                part="listbox"
                role="listbox"
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
                ?disabled="${x => x.disabled}"
            >
                <slot
                    ${slotted({ filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n), flatten: true, property: 'slottedOptions' })}
                >
                </slot>
            </div>
            </${anchoredRegionTag}>
    </template>
`;
