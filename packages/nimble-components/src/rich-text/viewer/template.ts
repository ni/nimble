import { html, ref, slotted } from '@microsoft/fast-element';
import { Listbox } from '@microsoft/fast-foundation';
import type { RichTextViewer } from '.';

export const template = html<RichTextViewer>`
    <template>
        <div ${ref('viewer')} class="viewer"></div>
        <slot
            hidden
            ${slotted({
        filter: (n: Node) => n instanceof HTMLElement && Listbox.slottedOptionFilter(n),
        flatten: true,
        property: 'slottedOptions'
    })}
        ></slot>
    </template>
`;
