import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleRichTextMentionUsersDirective } from './nimble-rich-text-mention-users.directive';

import '@ni/nimble-components/dist/esm/rich-text-mention/users/';

@NgModule({
    declarations: [NimbleRichTextMentionUsersDirective],
    imports: [CommonModule],
    exports: [NimbleRichTextMentionUsersDirective]
})
export class NimbleRichTextMentionUsersModule { }
