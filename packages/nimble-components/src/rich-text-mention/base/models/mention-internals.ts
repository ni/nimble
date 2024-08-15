import { ViewTemplate, html, observable } from '@microsoft/fast-element';
import type { MappingConfigs, MentionUpdateEmitter } from '../types';
import type { RichTextMentionValidator } from './mention-validator';

export interface MentionInternalsOptions<
    TValidator extends RichTextMentionValidator = RichTextMentionValidator
> {
    readonly icon: string;
    readonly character: string;
    readonly viewElement: string;
    readonly validator: TValidator;
}

/**
 * Internal mention state
 */
export class MentionInternals<
    TValidator extends RichTextMentionValidator = RichTextMentionValidator
> {
    /**
     * Mappings configured for the mention node
     */
    @observable
    public mappingConfigs?: MappingConfigs;

    /**
     * Regex used to extract user ID from user key (url)
     */
    @observable
    public pattern?: string;

    /**
     * Label to use as accessible name and title of mention button
     */
    @observable
    public buttonLabel?: string;

    /**
     * Template of the Icon to display on RichTextEditor Toolbar
     */
    public readonly iconTemplate: ViewTemplate;

    /**
     * Character to show respective mention list
     */
    public readonly character: string;

    /**
     * Mention view element to render in rich text components
     */
    public readonly viewElement: string;

    /**
     * The validator for the mention element.
     */
    public readonly validator: TValidator;

    /**
     * Function to invoke to emit a mention-update event
     */
    public readonly mentionUpdateEmitter: MentionUpdateEmitter;

    public constructor(
        options: MentionInternalsOptions<TValidator>,
        mentionUpdateEmitter: MentionUpdateEmitter
    ) {
        this.iconTemplate = html`<${options.icon} slot="start"></${options.icon}>`;
        this.character = options.character;
        this.viewElement = options.viewElement;
        this.validator = options.validator;
        this.mentionUpdateEmitter = mentionUpdateEmitter;
    }
}
