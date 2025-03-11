import { children, elements, html, ref } from '@ni/fast-element';
import type { RichTextViewer } from '.';

export const template = html<RichTextViewer>`
    <template ${children({ property: 'childItems', filter: elements() })}>
        <div ${ref('viewer')} class="viewer"></div>
    </template>
`;
