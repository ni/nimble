/* eslint-disable @typescript-eslint/indent */
import { html, ref, when } from '@microsoft/fast-element';
import type { TableColumnSelectCellView } from '.';
import { selectTag } from '../../../select';
import { overflow } from '../../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumnSelectCellView>`
    <template
        @click="${(x, c) => {
            if (typeof x.cellRecord?.href === 'string') {
                c.event.stopPropagation();
            }
            return true;
        }}"
    >
        ${when(x => typeof x.cellRecord?.href === 'string', html<TableColumnSelectCellView>`
            <${selectTag}
                ${ref('select')}
                ${overflow('hasOverflow')}
                href="${x => x.cellRecord?.href}"
                hreflang="${x => x.columnConfig?.hreflang}"
                ping="${x => x.columnConfig?.ping}"
                referrerpolicy="${x => x.columnConfig?.referrerpolicy}"
                rel="${x => x.columnConfig?.rel}"
                target="${x => x.columnConfig?.target}"
                type="${x => x.columnConfig?.type}"
                download="${x => x.columnConfig?.download}"
                underline-hidden="${x => x.columnConfig?.underlineHidden}"
                appearance="${x => x.columnConfig?.appearance}"
                title=${x => (x.hasOverflow ? x.text : null)}
            >
                ${x => x.text}
            </${selectTag}>`)}
        ${when(x => typeof x.cellRecord?.href !== 'string', html<TableColumnSelectCellView>`
            <span
                ${overflow('hasOverflow')}
                title=${x => (x.hasOverflow ? x.text : null)}
            >
                ${x => x.text}
            </span>`)}
    </template>
`;
