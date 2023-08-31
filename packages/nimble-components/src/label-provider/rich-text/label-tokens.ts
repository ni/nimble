import { DesignToken } from '@microsoft/fast-foundation';
import { richTextLabelDefaults } from './label-token-defaults';

export const richTextToggleBoldLabel = DesignToken.create<string>({
    name: 'rich-text-toggle-bold-label',
    cssCustomPropertyName: null
}).withDefault(richTextLabelDefaults.richTextToggleBoldLabel);

export const richTextToggleItalicsLabel = DesignToken.create<string>({
    name: 'rich-text-toggle-italics-label',
    cssCustomPropertyName: null
}).withDefault(richTextLabelDefaults.richTextToggleItalicsLabel);

export const richTextToggleBulletedListLabel = DesignToken.create<string>({
    name: 'rich-text-toggle-bulleted-list-label',
    cssCustomPropertyName: null
}).withDefault(richTextLabelDefaults.richTextToggleBulletedListLabel);

export const richTextToggleNumberedListLabel = DesignToken.create<string>(
    {
        name: 'rich-text-toggle-numbered-list-label',
        cssCustomPropertyName: null
    }
).withDefault(
    richTextLabelDefaults.richTextToggleNumberedListLabel
);
