import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightChatConversationDirective } from './spright-chat-conversation.directive';

import '@ni/spright-components/dist/esm/chat/conversation';

@NgModule({
    declarations: [
        SprightChatConversationDirective,
    ],
    imports: [CommonModule],
    exports: [
        SprightChatConversationDirective,
    ]
})
export class SprightChatConversationModule { }
