import { DesignSystem } from '@microsoft/fast-foundation';
import { RichTextMentionView } from '../../base/view';
import { template } from './template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-users-view': RichTextMentionUsersView;
    }
}

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
export const richTextMentionUsersViewTag = 'nimble-rich-text-mention-users-view';
