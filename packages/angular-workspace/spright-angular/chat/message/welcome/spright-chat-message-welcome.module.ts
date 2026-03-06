import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightChatMessageWelcomeDirective } from './spright-chat-message-welcome.directive';

import '@ni/spright-components/dist/esm/chat/message/welcome';

@NgModule({
    declarations: [
        SprightChatMessageWelcomeDirective
    ],
    imports: [CommonModule],
    exports: [
        SprightChatMessageWelcomeDirective
    ]
})
export class SprightChatMessageWelcomeModule { }