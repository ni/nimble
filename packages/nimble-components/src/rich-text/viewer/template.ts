import { children, elements, html, ref } from '@microsoft/fast-element';
import type { RichTextViewer } from '.';

export const template = html<RichTextViewer>`
    <template ${children({ property: 'childItems', filter: elements() })}>
        <div ${ref('viewer')} class="viewer"></div>
    </template>
`;
