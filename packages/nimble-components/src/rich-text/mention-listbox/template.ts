import { html, ref, slotted, when } from '@microsoft/fast-element';
import { Listbox } from '@microsoft/fast-foundation';
import type { RichTextMentionListbox } from '.';
import { anchoredRegionTag } from '../../anchored-region';
import { filterNoResultsLabel } from '../../label-provider/core/label-tokens';

/* eslint-disable @typescript-eslint/indent */
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
                class="
                    listbox
                    ${x => (x.filteredOptions.length === 0 ? 'empty' : '')}
                "
                part="listbox"
                role="listbox"
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
                ?disabled="${x => x.disabled}"
                style="--ni-private-listbox-available-viewport-height: ${x => x.availableViewportHeight}px;"
                ${ref('listbox')}
            >
                <div class="scrollable-region">
                    <slot name="option"
                        ${slotted({
                            filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n),
                            flatten: true,
                            property: 'slottedOptions'
                        })}
                    >
                    </slot>
                    ${when(x => x.filteredOptions.length === 0, html<RichTextMentionListbox>`
                        <span class="no-results-label">
                            ${x => filterNoResultsLabel.getValueFor(x)}
                        </span>
                    `)}
                </div>
            </div>
        </${anchoredRegionTag}>
    </template>
`;
