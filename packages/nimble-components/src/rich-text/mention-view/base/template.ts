import { html } from '@microsoft/fast-element';
import type { MentionView } from '.';

export const template = html<MentionView>`<span
    data-id="${x => x.dataId}"
    data-label="${x => x.dataLabel}"
    data-type="${x => x.dataType}"
    contenteditable="${x => x.contentEditable}"
>
    <slot></slot>
</span>`;
