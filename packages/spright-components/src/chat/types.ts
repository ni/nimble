/**
 * A message status in a chat conversation.
 * @public
 */
export const ChatMessageStatus = {
    outgoing: 'outgoing',
    incoming: 'incoming',
    system: 'system',
} as const;

export type ChatMessageStatus =
    (typeof ChatMessageStatus)[keyof typeof ChatMessageStatus];
