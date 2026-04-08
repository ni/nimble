import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightChatMessageSystemDirective } from './spright-chat-message-system.directive';

import '@ni/spright-components/dist/esm/chat/message/system';

@NgModule({
    declarations: [
        SprightChatMessageSystemDirective
    ],
    imports: [CommonModule],
    exports: [
        SprightChatMessageSystemDirective
    ]
})
export class SprightChatMessageSystemModule { }
