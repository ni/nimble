import { DesignSystem } from '@microsoft/fast-foundation';
import { MentionView } from '../base';
import { template } from './template';
import { styles } from './styles';

/**
 * The base class for users mention view
 */
export class MentionUsersView extends MentionView {}

const nimbleRichTextMentionUsersView = MentionUsersView.compose({
    baseName: 'rich-text-mention-users-view',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRichTextMentionUsersView());
export const mentionUsersViewTag = DesignSystem.tagFor(MentionUsersView);
