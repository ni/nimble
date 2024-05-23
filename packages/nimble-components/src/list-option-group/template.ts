import { html, ref, slotted, when } from '@microsoft/fast-element';
import type { ListOptionGroup } from '.';
import { overflow } from '../utilities/directive/overflow';
import { ListOption } from '../list-option';

const isListOption = (n: Node): boolean => {
    return n instanceof ListOption;
};

// prettier-ignore
export const template = html<ListOptionGroup>`
<template
    role="group"
    aria-label="${x => x.labelContent}"
>
    <span ${overflow('hasOverflow')} 
        class="label-display"
        aria-hidden="true"
        title=${x => (x.hasOverflow && x.labelContent ? x.labelContent : null)}
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        ${when(x => (typeof x.label === 'string'), html<ListOptionGroup>`${x => x.label}`)} 
        <slot ${ref('labelSlot')}
            class="label-slot ${x => (typeof x.label === 'string' ? 'hidden' : '')}"
            ${slotted({
        flatten: true,
        property: 'slottedElements'
    })}
            >
        </slot>
    </span>
    <span class="content" part="content" role="none">
        <slot name="options-slot"
        ${slotted({
        flatten: true,
        filter: (n: Node) => isListOption(n),
        property: 'listOptions'
    })}
></slot>
    </span>
</template>
`;
