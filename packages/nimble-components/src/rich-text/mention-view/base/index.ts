import { FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';

/**
 * The base class for Mention View Node
 */
export class RichTextMentionView extends FoundationElement {
    /**
     * Stores the unique URL of the mentioned user matching the pattern
     *
     * @public
     * HTML Attribute: mention-href
     */
    @attr({ attribute: 'mention-href' })
    public mentionHref?: string;

    /**
     * Stores the value of the rendering label
     *
     * @public
     * HTML Attribute: mention-label
     */
    @attr({ attribute: 'mention-label' })
    public mentionLabel?: string;

    /**
     * Maintains the state of the node whether in edit or view mode
     *
     * @public
     * HTML Attribute: mention-label
     */
    @attr({ mode: 'boolean', attribute: 'disable-editing' })
    public disableEditing = false;
}
