import { DesignSystem } from '@microsoft/fast-foundation';
import { RichTextMentionView } from '../base';
import { template } from './template';
import { styles } from './styles';

/**
 * A nimble styled rich text mention users view
 */
export class RichTextMentionUsersView extends RichTextMentionView {}

const nimbleRichTextMentionUsersView = RichTextMentionUsersView.compose({
    baseName: 'rich-text-mention-users-view',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextMentionUsersView());
export const richTextMentionUsersViewTag = DesignSystem.tagFor(RichTextMentionUsersView);
