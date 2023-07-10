import { html } from '@microsoft/fast-element';
import type { RichTextViewer } from '.';

export const template = html<RichTextViewer>`
    <template>
        <div class="container" id="viewer"></div>
    </template>
`;
