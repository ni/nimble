/* eslint-disable @typescript-eslint/indent */
import { html, ref, when } from '@microsoft/fast-element';
import type { TableColumnAnchorCellView } from '.';
import { anchorTag } from '../../../anchor';
import { overflow } from '../../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumnAnchorCellView>`
    <template
        @click="${(x, c) => {
            if (typeof x.cellRecord.href === 'string') {
                c.event.stopPropagation();
            }
            return true;
        }}"
    >
        ${when(x => typeof x.cellRecord.href === 'string', html<TableColumnAnchorCellView>`
            <${anchorTag}
                ${ref('anchor')}
                ${overflow('hasOverflow')}
                href="${x => x.cellRecord.href}"
                hreflang="${x => x.columnConfig.hreflang}"
                ping="${x => x.columnConfig.ping}"
                referrerpolicy="${x => x.columnConfig.referrerpolicy}"
                rel="${x => x.columnConfig.rel}"
                target="${x => x.columnConfig.target}"
                type="${x => x.columnConfig.type}"
                download="${x => x.columnConfig.download}"
                underline-hidden="${x => x.columnConfig.underlineHidden}"
                appearance="${x => x.columnConfig.appearance}"
                title=${x => (x.hasOverflow && !!x.content ? x.content : null)}
            >
                ${x => x.content}
            </${anchorTag}>`)}
        ${when(x => typeof x.cellRecord.href !== 'string', html<TableColumnAnchorCellView>`
            <span
                ${overflow('hasOverflow')}
                class="${x => (typeof x.cellRecord.label === 'string' ? '' : 'placeholder')}"
                title=${x => (x.hasOverflow && x.content ? x.content : null)}
            >
                ${x => x.content}
            </span>`)}
    </template>
`;
