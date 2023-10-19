import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { MentionView } from '../base';
import { template } from './template';
import { styles } from './styles';

/**
 * The base class for Mention View
 */
export class UserMentionView extends MentionView {
    @attr({ attribute: 'char' })
    public char?: string;
}

const mentionView = UserMentionView.compose({
    baseName: 'rich-text-user-mention-view',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(mentionView());
export const userMentionViewTag = DesignSystem.tagFor(UserMentionView);
