import { FoundationElement, DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { template } from '../user-mention-view/template';

/**
 * The base class for Mention View
 */
export class MentionView extends FoundationElement {
    @attr({ attribute: 'mention-url' })
    public mentionUrl?: string;

    @attr({ attribute: 'mention-type' })
    public mentionType?: string;

    @attr({ attribute: 'mention-label' })
    public mentionLabel?: string;

    @attr({ attribute: 'contenteditable' })
    public contenteditable?: string;
}

const mentionView = MentionView.compose({
    baseName: 'rich-text-mention-view',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(mentionView());
export const mentionViewTag = DesignSystem.tagFor(MentionView);
