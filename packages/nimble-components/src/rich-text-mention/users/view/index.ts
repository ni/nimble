import { customElement } from '@ni/fast-element';
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
@customElement({
    name: richTextMentionUsersViewTag,
    template,
    styles
})
export class RichTextMentionUsersView extends RichTextMentionView {}
