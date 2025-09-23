import { html, ViewTemplate } from '@ni/fast-element';
import {
    type FoundationElementTemplate
} from '@ni/fast-foundation';
import type { ChatMarkdownViewer } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template: FoundationElementTemplate<
ViewTemplate<ChatMarkdownViewer>> = (_context, _definition) => html<ChatMarkdownViewer>`
<div class="container">${x => x.markdownAsHtml}</div>
`;
/* eslint-enable @typescript-eslint/indent */
