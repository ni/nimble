import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightChatMessageDirective } from './spright-chat-message.directive';

import '@ni/spright-components/dist/esm/chat/message';

@NgModule({
    declarations: [
        SprightChatMessageDirective
    ],
    imports: [CommonModule],
    exports: [
        SprightChatMessageDirective
    ]
})
export class SprightChatMessageModule { }
