import { ChatInput } from '@ni/spright-components/dist/esm/chat/input';
import type { ChatInputSendEventDetail } from '@ni/spright-components/dist/esm/chat/input/types';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { type ChatInput };
export const SprightChatInput = wrap(ChatInput, {
    events: {
        onSend: 'send' as EventName<ChatInputSendEvent>,
    }
});
export interface ChatInputSendEvent extends CustomEvent<ChatInputSendEventDetail> {
    target: ChatInput;
}
