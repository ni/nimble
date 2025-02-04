import type { ChatMessageType } from '../../types';

describe('ChatMessage message type', () => {
    it('ChatMessageType fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const messageType: ChatMessageType = 'hello';
        expect(messageType).toEqual('hello');
    });
});
