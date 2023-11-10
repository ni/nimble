import { observable } from '@microsoft/fast-element';

export interface MentionInternalsOptions {
    readonly icon: string;
    readonly character: string;
    readonly pattern: string;
}

/**
 * Internal mention state
 */
export class MentionInternals<TMentionConfig> {
    /**
     * Configuration which will hold mentioning info, character, icon and pattern
     */
    @observable
    public mentionConfig?: TMentionConfig;

    /**
     * Whether this mention has a valid configuration.
     */
    @observable
    public validConfiguration = true;

    /**
     * Icon to display on RichTextEditor Toolbar
     */
    public readonly icon: string;

    /**
     * Character to show respective mention list
     */
    public readonly character: string;

    /**
     * Regex used to extract user ID from user key (url)
     */
    public readonly pattern: string;

    public constructor(options: MentionInternalsOptions) {
        this.icon = options.icon;
        this.character = options.character;
        this.pattern = options.pattern;
    }
}
