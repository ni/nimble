import { html, ref, when } from '@ni/fast-element';
import type { TableColumnAnchorCellView } from '.';
import { anchorTag } from '../../../anchor';
import { overflow } from '../../../utilities/directive/overflow';

export const template = html<TableColumnAnchorCellView>`
    <template
        @click="${(x, c) => {
            if (typeof x.cellRecord?.href === 'string') {
                c.event.stopPropagation();
            }
            return true;
        }}"
        class="${x => (x.isPlaceholder ? 'placeholder' : '')}"
    >
        ${when(x => x.showAnchor, html<TableColumnAnchorCellView>`
            <${anchorTag}
                ${ref('anchor')}
                ${overflow('hasOverflow')}
                ${'' /* tabindex managed dynamically by KeyboardNavigationManager */}
                tabindex="-1"
                href="${x => x.cellRecord?.href}"
                hreflang="${x => x.columnConfig?.hreflang}"
                ping="${x => x.columnConfig?.ping}"
                referrerpolicy="${x => x.columnConfig?.referrerpolicy}"
                rel="${x => x.columnConfig?.rel}"
                target="${x => x.columnConfig?.target}"
                type="${x => x.columnConfig?.type}"
                download="${x => x.columnConfig?.download}"
                ?underline-hidden="${x => x.columnConfig?.underlineHidden}"
                appearance="${x => x.columnConfig?.appearance}"
                title=${x => (x.hasOverflow ? x.text : null)}
            >
                ${x => x.text}
            </${anchorTag}>`)}
        ${when(x => !x.showAnchor, html<TableColumnAnchorCellView>`
            <span
                ${overflow('hasOverflow')}
                title=${x => (x.hasOverflow ? x.text : null)}
            >
                ${x => x.text}
            </span>`)}
    </template>
`;
