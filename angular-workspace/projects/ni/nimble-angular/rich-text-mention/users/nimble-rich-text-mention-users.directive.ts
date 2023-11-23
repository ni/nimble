import { Directive } from '@angular/core';
import { NimbleRichTextMentionDirective } from '@ni/nimble-angular/rich-text-mention';
import { type RichTextMentionUsers, richTextMentionUsersTag } from '@ni/nimble-components/dist/esm/rich-text-mention/users';

export type { RichTextMentionUsers };
export { richTextMentionUsersTag };

/**
 * Directive to provide Angular integration for the rich text mention users element.
 */
@Directive({
    selector: 'nimble-rich-text-mention-users'
})

export class NimbleRichTextMentionUsersDirective extends NimbleRichTextMentionDirective {}
