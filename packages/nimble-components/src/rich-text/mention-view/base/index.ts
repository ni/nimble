import { FoundationElement, DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { template } from './template';

/**
 * The base class for Mention View
 */
export class MentionView extends FoundationElement {
    @attr({ attribute: 'data-id' })
    public dataId?: string;

    @attr({ attribute: 'data-type' })
    public dataType?: string;

    @attr({ attribute: 'data-label' })
    public dataLabel?: string;

    @attr({ attribute: 'contenteditable' })
    public contenteditable?: string;

    @attr
    public char = '';

    public setChar(value: string): void {
        this.char = value;
    }
}

const mentionView = MentionView.compose({
    baseName: 'rich-text-mention-view',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(mentionView());
export const mentionViewTag = DesignSystem.tagFor(MentionView);
