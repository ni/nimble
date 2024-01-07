import { DesignSystem } from '@microsoft/fast-foundation';
import { RichTextMentionView } from '../../base/view';
import { template } from './template';
import { styles } from './styles';

export const richTextMentionUsersViewTag = 'nimble-rich-text-mention-users-view';
declare global {
    interface HTMLElementTagNameMap {
        [richTextMentionUsersViewTag]: RichTextMentionUsersView;
    }
}

/**
 * A nimble styled rich text mention users view
 */
export class RichTextMentionUsersView extends RichTextMentionView {}

const nimbleRichTextMentionUsersView = RichTextMentionUsersView.compose({
    baseName: richTextMentionUsersViewTag,
    template,
    styles
});

DesignSystem.getOrCreate()
    .register(nimbleRichTextMentionUsersView());
