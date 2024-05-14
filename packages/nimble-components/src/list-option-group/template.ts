import { html, ref, slotted } from '@microsoft/fast-element';
import { isListboxOption } from '@microsoft/fast-foundation';
import type { ListOptionGroup } from '.';
import { overflow } from '../utilities/directive/overflow';

const slottedContentFilter = (n: Node): boolean => {
    const allowed = n instanceof HTMLElement && (isListboxOption(n) || n instanceof Text);
    return allowed;
};

// prettier-ignore
export const template = html<ListOptionGroup>`
<template
    role="group"
    aria-label="${x => x.labelContent}"
>
    <span ${overflow('hasOverflow')}
        class="header"
        aria-hidden="true"
        title=${x => (x.hasOverflow && x.labelContent ? x.labelContent : null)}
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        ${x => x.labelContent}
        <slot ${ref('labelSlot')}
            class="label-slot"
            ${slotted({
        filter: (n: Node) => slottedContentFilter(n),
        flatten: true,
        property: 'slottedElements',
    })}
        >
        </slot>
    </span>
    <span class="content" part="content" role="none">
        <slot name="options-slot"></slot>
    </span>
</template>
`;
