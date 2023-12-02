import { observable } from '@microsoft/fast-element';
import type { MentionConfig } from './mention-config';
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
     * Mention-specific configuration. Can be used to, for example, pass mention-specific configuration to views.
     */
    @observable
    public mentionConfig?: MentionConfig;

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
     * Icon to display on RichTextEditor Toolbar
     */
    public readonly icon: string;

    /**
     * Character to show respective mention list
     */
    public readonly character: string;

    /**
     * Mention view element to render in rich text components
     */
    public readonly viewElement: string;

    /**
     * Funtion to invoke to emit a mention-update event
     */
    public readonly mentionUpdateEmitter: MentionUpdateEmitter;

    public constructor(options: MentionInternalsOptions, mentionUpdateEmitter: MentionUpdateEmitter) {
        this.icon = options.icon;
        this.character = options.character;
        this.viewElement = options.viewElement;
        this.mentionUpdateEmitter = mentionUpdateEmitter;
    }
}
