import { attr, customElement } from '@ni/fast-element';
import { type DesignTokensFor, LabelProviderBase } from '../base';
import {
    richTextToggleBoldLabel,
    richTextToggleItalicsLabel,
    richTextToggleBulletedListLabel,
    richTextToggleNumberedListLabel
} from './label-tokens';
import { styles } from '../base/styles';

export const labelProviderRichTextTag = 'nimble-label-provider-rich-text';

declare global {
    interface HTMLElementTagNameMap {
        [labelProviderRichTextTag]: LabelProviderRichText;
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
@customElement({
    name: labelProviderRichTextTag,
    styles
})
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
