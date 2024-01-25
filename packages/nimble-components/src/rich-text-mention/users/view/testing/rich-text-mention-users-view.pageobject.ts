import type { RichTextMentionUsersView } from '..';

/**
 * Page object for the `nimble-rich-text-mention-users-view` component.
 */
export class RichTextMentionUsersViewPageObject {
    public constructor(
        private readonly richTextMentionUsersViewElement: RichTextMentionUsersView
    ) {}

    public getTextContent(): string {
        return (
            this.richTextMentionUsersViewElement.shadowRoot?.firstElementChild
                ?.textContent ?? ''
        );
    }
}
