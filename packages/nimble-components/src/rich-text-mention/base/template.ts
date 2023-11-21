import { slotted, html } from '@microsoft/fast-element';
import type { RichTextMention } from '.';

export const template = html<RichTextMention>`<slot
    ${slotted('mappings')}
    name="mapping"
></slot>`;
