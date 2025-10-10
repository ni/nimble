/**
 * A message type in a chat conversation.
 * @public
 */
export const ChatMessageType = {
    system: undefined,
    outbound: 'outbound',
    inbound: 'inbound'
} as const;

export type ChatMessageType = (typeof ChatMessageType)[keyof typeof ChatMessageType];
