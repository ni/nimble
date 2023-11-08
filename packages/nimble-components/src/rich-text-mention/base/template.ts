import { slotted, html } from '@microsoft/fast-element';
import type { RichTextMention, RichTextMentionConfig } from '.';
import type { RichTextMentionValidator } from './models/mention-validator';

export const template = html<
RichTextMention<RichTextMentionConfig, RichTextMentionValidator<[]>>
>`<slot ${slotted('mappings')} name="mapping"></slot>`;
