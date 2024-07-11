import { html, ref, slotted } from '@microsoft/fast-element';
import { Listbox } from '@microsoft/fast-foundation';
import type { RichTextMentionListbox } from '.';
import { anchoredRegionTag } from '../../anchored-region';

// prettier-ignore
export const template = html<RichTextMentionListbox>`
    <template>
        <${anchoredRegionTag}
            ${ref('region')}
            class="anchored-region"
            fixed-placement
            auto-update-mode="auto"
            vertical-default-position="bottom"
            vertical-positioning-mode="locktodefault"
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
                style="--ni-private-listbox-available-viewport-height: ${x => x.availableViewportHeight}px;"
                ${ref('listbox')}
            >
                <slot name="option"
                    ${slotted({ filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n), flatten: true, property: 'slottedOptions' })}
                >
                </slot>
            </div>
        </${anchoredRegionTag}>
    </template>
`;
