/**
 * Appearances of chat conversation.
 * @public
 */
export const ChatConversationAppearance = {
    default: undefined,
    overlay: 'overlay'
} as const;

export type ChatConversationAppearance = (typeof ChatConversationAppearance)[keyof typeof ChatConversationAppearance];
