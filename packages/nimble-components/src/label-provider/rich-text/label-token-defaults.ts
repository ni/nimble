import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const richTextLabelDefaults: {
    readonly [key in TokenName]: string;
} = {
    richTextToggleBoldLabel: 'Bold',
    richTextToggleItalicsLabel: 'Italics',
    richTextToggleBulletedListLabel: 'Bulleted List',
    richTextToggleNumberedListLabel: 'Numbered List'
};
