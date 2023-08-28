import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const richTextEditorLabelDefaults: { readonly [key in TokenName]: string } = {
    richTextEditorToggleBoldLabel: 'Bold',
    richTextEditorToggleItalicsLabel: 'Italics',
    richTextEditorToggleBulletListLabel: 'Bullet List',
    richTextEditorToggleNumberedListLabel: 'Numbered List',
};
