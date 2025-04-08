import { Directive } from '@angular/core';
import { type ChatConversation, chatConversationTag } from '@ni/spright-components/dist/esm/chat/conversation';

export type { ChatConversation };
export { chatConversationTag };

/**
 * Directive to provide Angular integration for the chat conversation.
 */
@Directive({
    selector: 'spright-chat-conversation'
})
export class SprightChatConversationDirective { }
