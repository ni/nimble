import { elements, html, slotted } from '@microsoft/fast-element';
import type { Accordion } from '.';

// prettier-ignore
export const template = html<Accordion>`
    <template>
        <slot ${slotted({ property: 'accordionItems', filter: elements() })}></slot>
        <slot name="item" part="item" ${slotted('accordionItems')}></slot>
    </template>
`;