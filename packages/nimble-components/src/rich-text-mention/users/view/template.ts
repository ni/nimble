import { html } from '@ni/fast-element';
import type { RichTextMentionUsersView } from '.';

export const template = html<RichTextMentionUsersView>`<span class="control"
    >@${x => x.mentionLabel}</span
>`;
