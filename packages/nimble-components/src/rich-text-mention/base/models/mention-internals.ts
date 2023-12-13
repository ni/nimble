import { ViewTemplate, html, observable } from '@microsoft/fast-element';
import type { MappingConfigs, MentionUpdateEmitter } from '../types';

export interface MentionInternalsOptions {
    readonly icon: string;
    readonly character: string;
    readonly viewElement: string;
}

/**
 * Internal mention state
 */
export class MentionInternals {
    /**
     * Mappings configured for the mention node
     */
    @observable
    public mappingConfigs?: MappingConfigs;

    /**
     * Whether this mention has a valid configuration.
     */
    @observable
    public validConfiguration = true;

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
     * Function to invoke to emit a mention-update event
     */
    public readonly mentionUpdateEmitter: MentionUpdateEmitter;

    public constructor(
        options: MentionInternalsOptions,
        mentionUpdateEmitter: MentionUpdateEmitter
    ) {
        this.iconTemplate = html`<${options.icon} slot="start"></${options.icon}>`;
        this.character = options.character;
        this.viewElement = options.viewElement;
        this.mentionUpdateEmitter = mentionUpdateEmitter;
    }
}
