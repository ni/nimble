/**
 * A message type in a chat markdown viewer conversation.
 * @public
 */
export const ChatMarkdownViewerType = {
    system: undefined,
    outbound: 'outbound',
    inbound: 'inbound'
} as const;

export type ChatMarkdownViewerType =
    (typeof ChatMarkdownViewerType)[keyof typeof ChatMarkdownViewerType];
