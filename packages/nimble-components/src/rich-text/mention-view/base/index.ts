import { FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';

/**
 * The base class for Mention View
 */
export class MentionView extends FoundationElement {
    /**
     * Stores the unique value of the mentioned URL matching the pattern
     *
     * @public
     * HTML Attribute: mention-href
     */
    @attr({ attribute: 'mention-href' })
    public mentionHref?: string;

    /**
     * Stores the value of the rendering label and to get the markdown output
     *
     * @public
     * HTML Attribute: mention-label
     */
    @attr({ attribute: 'mention-label' })
    public mentionLabel?: string;
}
