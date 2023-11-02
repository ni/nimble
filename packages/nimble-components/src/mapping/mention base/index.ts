import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';

/**
 * Base class for mapping configuration elements
 */
export abstract class MappingMentionBase extends FoundationElement {
    /**
     * The data value that is mapped to another representation
     */
    @attr({ attribute: 'mention-url' })
    public mentionUrl?: string;

    @attr({ attribute: 'display-name' })
    public displayName?: string;
}
