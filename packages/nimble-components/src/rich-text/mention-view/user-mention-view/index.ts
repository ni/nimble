import { DesignSystem } from '@microsoft/fast-foundation';
import { MentionView } from '../base';
import { template } from '../base/template';
import { styles } from '../base/styles';

/**
 * The base class for Mention View
 */
export class UserMentionView extends MentionView {
    public constructor() {
        super();
        this.setChar('@');
    }
}

const mentionView = UserMentionView.compose({
    baseName: 'rich-text-user-mention-view',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(mentionView());
export const userMentionViewTag = DesignSystem.tagFor(UserMentionView);
