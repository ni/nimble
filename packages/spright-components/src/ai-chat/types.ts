/**
 * An actor in an AI chat conversation.
 * @public
 */
export const AIChatActor = {
    bot: 'bot',
    system: 'system',
    user: 'user',
} as const;

export type AIChatActor =
    (typeof AIChatActor)[keyof typeof AIChatActor];
