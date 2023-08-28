import { DesignToken } from '@microsoft/fast-foundation';
import { richTextEditorLabelDefaults } from './label-token-defaults';

export const richTextEditorToggleBoldLabel = DesignToken.create<string>({
    name: 'rich-text-editor-toggle-bold-label',
    cssCustomPropertyName: null
}).withDefault(richTextEditorLabelDefaults.richTextEditorToggleBoldLabel);

export const richTextEditorToggleItalicsLabel = DesignToken.create<string>({
    name: 'rich-text-editor-toggle-italics-label',
    cssCustomPropertyName: null
}).withDefault(richTextEditorLabelDefaults.richTextEditorToggleItalicsLabel);

export const richTextEditorToggleBulletListLabel = DesignToken.create<string>({
    name: 'rich-text-editor-toggle-bullet-list-label',
    cssCustomPropertyName: null
}).withDefault(richTextEditorLabelDefaults.richTextEditorToggleBulletListLabel);

export const richTextEditorToggleNumberedListLabel = DesignToken.create<string>(
    {
        name: 'rich-text-editor-toggle-numbered-list-label',
        cssCustomPropertyName: null
    }
).withDefault(
    richTextEditorLabelDefaults.richTextEditorToggleNumberedListLabel
);
