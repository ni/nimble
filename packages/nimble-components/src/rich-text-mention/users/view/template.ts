import { html } from '@microsoft/fast-element';
import type { RichTextMentionUsersView } from '.';

// Setting `contenteditable="true"` on the slot serves as a workaround to address the issue in the Chrome browser
// that arises when the mention user view is activated at the end of a line in the rich text editor while in edit mode.
// This can be removed when the below issue is resolved
// See: https://github.com/ni/nimble/issues/1659
export const template = html<RichTextMentionUsersView>`<span
        class="control"
        part="control"
        >@${x => x.mentionLabel}</span
    ><slot contenteditable="true"></slot>`;
