import { html, ref } from '@microsoft/fast-element';
import type { RichTextViewer } from '.';

export const template = html<RichTextViewer>`
    <div ${ref('viewer')} class="viewer"></div>
`;
