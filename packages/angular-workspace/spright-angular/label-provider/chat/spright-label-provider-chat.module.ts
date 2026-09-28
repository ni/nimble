import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SprightLabelProviderChatDirective } from './spright-label-provider-chat.directive';
import { SprightLabelProviderChatWithDefaultsDirective } from './spright-label-provider-chat-with-defaults.directive';

import '@ni/spright-components/dist/esm/label-provider/chat';

@NgModule({
    declarations: [SprightLabelProviderChatDirective, SprightLabelProviderChatWithDefaultsDirective],
    imports: [CommonModule],
    exports: [SprightLabelProviderChatDirective, SprightLabelProviderChatWithDefaultsDirective]
})
export class SprightLabelProviderChatModule { }