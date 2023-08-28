import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { DesignTokensFor, LabelProviderBase } from '../base';
import {
    richTextEditorToggleBoldLabel,
    richTextEditorToggleItalicsLabel,
    richTextEditorToggleBulletListLabel,
    richTextEditorToggleNumberedListLabel
} from './label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-rich-text-editor': LabelProviderRichTextEditor;
    }
}

const supportedLabels = {
    toggleBold: richTextEditorToggleBoldLabel,
    toggleItalics: richTextEditorToggleItalicsLabel,
    toggleBulletList: richTextEditorToggleBulletListLabel,
    toggleNumberedList: richTextEditorToggleNumberedListLabel
} as const;

/**
 * Label provider for the Nimble rich text editor
 */
export class LabelProviderRichTextEditor
    extends LabelProviderBase<typeof supportedLabels>
    implements DesignTokensFor<typeof supportedLabels> {
    @attr({ attribute: 'toggle-bold' })
    public toggleBold: string | undefined;

    @attr({ attribute: 'toggle-italics' })
    public toggleItalics: string | undefined;

    @attr({ attribute: 'toggle-bullet-list' })
    public toggleBulletList: string | undefined;

    @attr({ attribute: 'toggle-numbered-list' })
    public toggleNumberedList: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const nimbleLabelProviderRichTextEditor = LabelProviderRichTextEditor.compose({
    baseName: 'label-provider-rich-text-editor'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderRichTextEditor());
export const labelProviderRichTextEditorTag = DesignSystem.tagFor(
    LabelProviderRichTextEditor
);
