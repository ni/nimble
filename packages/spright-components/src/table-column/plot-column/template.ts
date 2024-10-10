import { elements, html, ref, slotted } from '@microsoft/fast-element';
import { overflow } from '@ni/nimble-components/src/utilities/directive/overflow';
import type { TableColumnPlot } from '.';

// Avoiding a wrapping <template> and be careful about starting and ending whitespace
// so the template can be composed into other column header templates
// prettier-ignore
export const template = html<TableColumnPlot>`<span
    ${overflow('hasOverflow')}
    class="header-content"
    title=${x => (x.hasOverflow && x.headerTextContent ? x.headerTextContent : null)}
>
    <slot ${ref('contentSlot')}></slot>
    <slot ${slotted({ property: 'unitElements', filter: elements() })} name="unit"></slot>
</span>`;
