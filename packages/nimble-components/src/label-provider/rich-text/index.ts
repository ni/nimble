import { attr } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { type DesignTokensFor, LabelProviderBase } from '../base';
import {
    richTextToggleBoldLabel,
    richTextToggleItalicsLabel,
    richTextToggleBulletedListLabel,
    richTextToggleNumberedListLabel
} from './label-tokens';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-rich-text': LabelProviderRichText;
    }
}

const supportedLabels = {
    toggleBold: richTextToggleBoldLabel,
    toggleItalics: richTextToggleItalicsLabel,
    toggleBulletedList: richTextToggleBulletedListLabel,
    toggleNumberedList: richTextToggleNumberedListLabel
} as const;

/**
 * Label provider for the Nimble rich text component
 */
export class LabelProviderRichText
    extends LabelProviderBase<typeof supportedLabels>
    implements DesignTokensFor<typeof supportedLabels> {
    @attr({ attribute: 'toggle-bold' })
    public toggleBold: string | undefined;

    @attr({ attribute: 'toggle-italics' })
    public toggleItalics: string | undefined;

    @attr({ attribute: 'toggle-bulleted-list' })
    public toggleBulletedList: string | undefined;

    @attr({ attribute: 'toggle-numbered-list' })
    public toggleNumberedList: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const nimbleLabelProviderRichText = LabelProviderRichText.compose({
    baseName: 'label-provider-rich-text',
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderRichText());
export const labelProviderRichTextTag = 'nimble-label-provider-rich-text';
