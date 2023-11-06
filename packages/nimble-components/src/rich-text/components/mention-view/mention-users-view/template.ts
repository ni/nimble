import { html } from '@microsoft/fast-element';
import type { MentionUsersView } from '.';

export const template = html<MentionUsersView>`<span
    mention-href="${x => x.mentionHref}"
    mention-label="${x => x.mentionLabel}"
>
    <slot></slot>
</span>`;
