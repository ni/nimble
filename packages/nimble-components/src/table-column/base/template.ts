import { html, ref, slotted } from '@microsoft/fast-element';
import type { TableColumn } from '.';

// prettier-ignore
export const template = html<TableColumn>`
    <template slot="${x => x.columnInternals.uniqueId}">
        <span
            ${ref('headerSpan')}
            class="header-content"
            @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.slottedHeaderContent.map(element => element.textContent?.trim()).join(' ')
                    && x.headerSpan.offsetWidth < x.headerSpan.scrollWidth;
    }}"
            @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
            title=${x => (x.isValidContentAndHasOverflow ? x.slottedHeaderContent.map(element => element.textContent?.trim()).join(' ') : null)}
        >
            <slot ${slotted('slottedHeaderContent')}></slot>
        </span>
    </template>
`;
