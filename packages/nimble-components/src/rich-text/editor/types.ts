import type { SuggestionProps } from '@tiptap/suggestion';

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

export type ActiveMentionCommandEmitter = (
    command?: SuggestionProps['command']
) => void;

export type ActiveMentionCharacterEmitter = (character: string) => void;
