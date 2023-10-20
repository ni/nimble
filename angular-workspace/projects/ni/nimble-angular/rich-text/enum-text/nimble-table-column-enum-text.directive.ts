import { Directive } from '@angular/core';
import { MappingKeyType } from '@ni/nimble-components/dist/esm/table-column/enum-base/types';
import type { RichTextEnumMention, richTextEnumMentionTextTag } from '@ni/nimble-components/dist/esm/rich-text/editor/enum-text';

export { MappingKeyType };
export type { RichTextEnumMention };
export { richTextEnumMentionTextTag };

/**
 * Directive to provide Angular integration for the table column element for enum text.
 */
@Directive({
    selector: 'nimble-rich-text-mention-users'
})
export class NimbleTableColumnEnumMentionDirective {
}
