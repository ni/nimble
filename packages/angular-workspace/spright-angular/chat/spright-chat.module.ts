import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightChatConversationDirective } from './spright-chat-conversation.directive';
import { SprightChatMessageDirective } from './spright-chat-message.directive';

import '@ni/spright-components/dist/esm/chat/conversation';
import '@ni/spright-components/dist/esm/chat/message';

@NgModule({
    declarations: [
        SprightChatConversationDirective,
        SprightChatMessageDirective
    ],
    imports: [CommonModule],
    exports: [
        SprightChatConversationDirective,
        SprightChatMessageDirective
    ]
})
export class SprightChatModule { }
