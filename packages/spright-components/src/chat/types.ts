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

/**
 * The type of the detail associated with the `submit`
 * event on the input toolbar.
 */
export interface ChatInputToolbarSubmitMessageEventDetail {
    message: string;
}