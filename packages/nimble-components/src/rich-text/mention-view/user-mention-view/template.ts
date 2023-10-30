import { html } from '@microsoft/fast-element';
import type { MentionView } from '../base';

export const template = html<MentionView>`<span
    mention-url="${x => x.mentionUrl}"
    mention-label="${x => x.mentionLabel}"
    mention-type="${x => x.mentionType}"
    contenteditable="${x => x.contentEditable}"
>
    <slot></slot>
</span>`;
