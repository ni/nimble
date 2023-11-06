import { html } from '@microsoft/fast-element';
import type { MentionView } from '../base';

export const template = html<MentionView>`<span
    mention-url="${x => x.mentionUrl}"
    mention-label="${x => x.mentionLabel}"
>
    <slot></slot>
</span>`;
