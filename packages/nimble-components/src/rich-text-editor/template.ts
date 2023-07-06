import { html } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';

export const template = html<RichTextEditor>`
    <template>
        <div id="editor"></div>
    </template>
`;
