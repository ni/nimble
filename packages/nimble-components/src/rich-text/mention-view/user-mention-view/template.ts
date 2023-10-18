import { html } from '@microsoft/fast-element';
import type { UserMentionView } from '.';

export const template = html<UserMentionView>`<a
    data-id="${x => x.dataId}"
    data-label="${x => x.dataLabel}"
    data-type="${x => x.dataType}"
>
    ${x => `${x.char}${x.dataLabel ?? ''}`}
</a>`;
