import { DesignSystem } from '@microsoft/fast-foundation';
import { RichTextMentionView } from '../../base/view';
import { template } from './template';
import { styles } from './styles';

const baseName = 'rich-text-mention-users-view';
export const richTextMentionUsersViewTag = `nimble-${baseName}`;
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
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRichTextMentionUsersView());
