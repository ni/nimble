import { html, ref, slotted } from '@microsoft/fast-element';
import type { RichTextViewer } from '.';
import { ListOption } from '../../list-option';

export const template = html<RichTextViewer>`
    <template>
        <div ${ref('viewer')} class="viewer"></div>
        <slot hidden ${slotted({
        filter: (n: Node) => n instanceof ListOption,
        flatten: true,
        property: 'slottedOptions',
    })}></slot>
    </template>
`;
