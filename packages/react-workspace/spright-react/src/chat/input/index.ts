import { ChatInput } from '@ni/spright-components/dist/esm/chat/input';
import type { ChatInputSendEventDetail } from '@ni/spright-components/dist/esm/chat/input/types';
import { wrap } from '../../utilities/react-wrapper';

export { type ChatInput };
export const SprightChatInput = wrap(ChatInput, {
    events: {
        onSend: 'send',
    }
});
export interface ChatInputSendEvent extends CustomEvent<ChatInputSendEventDetail> {
    target: ChatInput;
}
