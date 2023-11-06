import { slotted, html } from '@microsoft/fast-element';
import type { RichTextMentionBase, RichTextMentionConfig } from '.';
import type { RichTextMentionBaseValidator } from './models/rich-text-mention-base-validator';

export const template = html<
RichTextMentionBase<RichTextMentionConfig, RichTextMentionBaseValidator<[]>>
>`<slot ${slotted('mappings')} name="mapping"></slot>`;
