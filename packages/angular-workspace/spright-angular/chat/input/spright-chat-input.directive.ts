import { Directive } from '@angular/core';
import { type ChatInput, chatInputTag } from '@ni/spright-components/dist/esm/chat/input';

export type { ChatInput };
export { chatInputTag };

/**
 * Directive to provide Angular integration for the chat input.
 */
@Directive({
    selector: 'spright-chat-input'
})
export class SprightChatInputDirective { }
