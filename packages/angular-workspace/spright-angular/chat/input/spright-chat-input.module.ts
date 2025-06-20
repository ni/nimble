import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightChatInputDirective } from './spright-chat-input.directive';

import '@ni/spright-components/dist/esm/chat/input';

@NgModule({
    declarations: [SprightChatInputDirective],
    imports: [CommonModule],
    exports: [SprightChatInputDirective]
})
export class SprightChatInputModule { }
