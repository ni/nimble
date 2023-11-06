import { html } from '@microsoft/fast-element';
import type { RichTextMentionUsersView } from '.';

export const template = html<RichTextMentionUsersView>`<span
    class="control"
    part="control"
    mention-href="${x => x.mentionHref}"
    mention-label="${x => x.mentionLabel}"
>
    <slot></slot>
</span>`;
