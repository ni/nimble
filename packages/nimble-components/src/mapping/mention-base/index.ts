import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';

/**
 * Base class for mention mapping configuration elements
 * If additional properties needed, add it in derived class
 */
export abstract class MappingMentionBase extends FoundationElement {
    @attr({ attribute: 'mention-href' })
    public mentionHref?: string;

    @attr({ attribute: 'display-name' })
    public displayName?: string;
}