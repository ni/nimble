import { html, slotted, elements, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconArrowPartialRotateLeftTag } from '@ni/nimble-components/dist/esm/icons/arrow-partial-rotate-left';
import { iconTimesTag } from '@ni/nimble-components/dist/esm/icons/times';
import type { FvBulkEditField } from '.';

export const template = html<FvBulkEditField>`
    <div class="field">
        <span class="marker" aria-hidden="true"></span>
        <div class="content">
            <div class="header">
                <span class="label">${x => x.label}</span>
                ${when(
                    x => x.statusText.length > 0,
                    html<FvBulkEditField>`<span class="status">${x => x.statusText}</span>`
                )}
                <div class="actions">
                <${buttonTag}
                    appearance="ghost"
                    content-hidden
                    title="${x => `Reset ${x.label}`}"
                    ?disabled="${x => x.resetDisabled}"
                    @click="${x => x.reset()}"
                ><${iconArrowPartialRotateLeftTag} slot="start"></${iconArrowPartialRotateLeftTag}>Reset ${x => x.label}</${buttonTag}>
                <${buttonTag}
                    appearance="ghost"
                    content-hidden
                    title="${x => `Clear ${x.label} for selected rows`}"
                    ?disabled="${x => x.clearDisabled}"
                    @click="${x => x.clear()}"
                ><${iconTimesTag} slot="start"></${iconTimesTag}>Clear ${x => x.label}</${buttonTag}>
                <slot name="actions"></slot>
                </div>
            </div>
            <div class="control">
                <slot ${slotted({ property: 'controls', filter: elements() })}></slot>
            </div>
        </div>
    </div>
`;
