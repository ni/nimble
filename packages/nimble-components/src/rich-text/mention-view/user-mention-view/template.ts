import { html } from '@microsoft/fast-element';
import type { MentionUsersView } from '.';

export const template = html<MentionUsersView>`<span
>@${x => x.mentionLabel}</span>`;
