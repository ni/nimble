import { html, ViewTemplate } from '@ni/fast-element';
import {
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { ChatMarkdownViewer, ChatMarkdownViewerOptions } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<ChatMarkdownViewer>,
ChatMarkdownViewerOptions
> = (_context, _definition) => html<ChatMarkdownViewer>`
    <div class="container">
    </div>
`;
/* eslint-enable @typescript-eslint/indent */
