import { html, ref } from '@microsoft/fast-element';
import type { TableColumn } from '.';

// Avoiding a wrapping <template> and be careful about starting and ending whitspace
// so the template can be composed into other column header templates
// prettier-ignore
export const template = html<TableColumn>`<span
    ${ref('headerSpan')}
    class="header-content"
    @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.headerTextContent && x.headerSpan.offsetWidth < x.headerSpan.scrollWidth;
    }}"
    @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
    title=${x => (x.isValidContentAndHasOverflow ? x.headerTextContent : null)}
>
    <slot ${ref('contentSlot')}></slot>
</span>`;
