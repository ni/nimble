import { html } from '@microsoft/fast-element';
import type { PerspectiveViewerNimbleTable } from '.';

export const template = html<PerspectiveViewerNimbleTable>`
    <pre>${x => x.content}</pre>
`;
