/**
 * An actor in a chat conversation.
 * @public
 */
export const ChatActor = {
    bot: 'bot',
    system: 'system',
    user: 'user',
} as const;

export type ChatActor =
    (typeof ChatActor)[keyof typeof ChatActor];
