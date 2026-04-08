import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightChatMessageOutboundDirective } from './spright-chat-message-outbound.directive';

import '@ni/spright-components/dist/esm/chat/message/outbound';

@NgModule({
    declarations: [
        SprightChatMessageOutboundDirective
    ],
    imports: [CommonModule],
    exports: [
        SprightChatMessageOutboundDirective
    ]
})
export class SprightChatMessageOutboundModule { }
