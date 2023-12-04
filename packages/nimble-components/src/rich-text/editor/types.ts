/**
 * TipTap node types.
 * @public
 */
export const TipTapNodeName = {
    bulletList: 'bulletList',
    numberedList: 'orderedList'
} as const;

export type TipTapNodeName =
    (typeof TipTapNodeName)[keyof typeof TipTapNodeName];

export interface MentionExtensionConfig {
    name: string;
    key: string;
    character: string;
    viewElement: string;
}

export interface MentionDetail {
    href: string;
    displayName: string;
}
export const mentionPluginPrefix = 'mention-plugin-';
