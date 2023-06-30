import { html } from '@microsoft/fast-element';
import type { RichTextViewer } from '.';

export const template = html<RichTextViewer>`
    <template>
        <div id="viewer"></div>
    </template>
`;
