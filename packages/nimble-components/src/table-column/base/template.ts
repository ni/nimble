import { html, ref } from '@microsoft/fast-element';
import type { TableColumn } from '.';
import { overflow } from '../../utilities/directive/overflow';

// Avoiding a wrapping <template> and be careful about starting and ending whitspace
// so the template can be composed into other column header templates
// prettier-ignore
export const template = html<TableColumn>`<span
    ${overflow('hasOverflow')}
    class="header-content"
    title=${x => (x.hasOverflow && x.headerTextContent ? x.headerTextContent : null)}
>
    <slot ${ref('contentSlot')}></slot>
</span>`;
