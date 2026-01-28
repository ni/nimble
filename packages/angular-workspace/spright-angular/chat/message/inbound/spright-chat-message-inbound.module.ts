import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightChatMessageInboundDirective } from './spright-chat-message-inbound.directive';

import '@ni/spright-components/dist/esm/chat/message/inbound';

@NgModule({
    declarations: [
        SprightChatMessageInboundDirective
    ],
    imports: [CommonModule],
    exports: [
        SprightChatMessageInboundDirective
    ]
})
export class SprightChatMessageInboundModule { }
