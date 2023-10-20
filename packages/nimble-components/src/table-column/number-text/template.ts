import { html, ref, slotted } from '@microsoft/fast-element';
import { overflow } from '../../utilities/directive/overflow';
import type { TableColumnNumberText } from '.';

// Avoiding a wrapping <template> and be careful about starting and ending whitspace
// so the template can be composed into other column header templates
// prettier-ignore
export const template = html<TableColumnNumberText>`<span
    ${overflow('hasOverflow')}
    class="header-content"
    title=${x => (x.hasOverflow && x.headerTextContent ? x.headerTextContent : null)}
>
    <slot ${ref('contentSlot')}></slot>
    <slot ${slotted('unitElements')} name="unit"></slot>
</span>`;
