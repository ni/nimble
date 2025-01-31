/**
 * A message type in a chat conversation.
 * @public
 */
export const ChatMessageType = {
    outbound: 'outbound',
    inbound: 'inbound',
    system: 'system'
} as const;

export type ChatMessageType =
    (typeof ChatMessageType)[keyof typeof ChatMessageType];
