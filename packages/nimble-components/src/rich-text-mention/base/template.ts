import { slotted, html } from '@ni/fast-element';
import type { RichTextMention } from '.';

export const template = html<RichTextMention>`<slot
    ${slotted('mappingElements')}
    name="mapping"
></slot>`;
