/**
 * A message type in a chat conversation.
 * @public
 * @deprecated Use specific message component types instead
 */
export const ChatMessageType = {
    system: undefined,
    outbound: 'outbound',
    inbound: 'inbound'
} as const;

export type ChatMessageType = (typeof ChatMessageType)[keyof typeof ChatMessageType];
