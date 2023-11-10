import { observable } from '@microsoft/fast-element';

export interface MentionInternalsOptions {
    readonly icon: string;
    readonly character: string;
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
     * Regex used to extract user ID from user key (url)
     */
    public pattern?: string;

    /**
     * Icon to display on RichTextEditor Toolbar
     */
    public readonly icon: string;

    /**
     * Character to show respective mention list
     */
    public readonly character: string;

    public constructor(options: MentionInternalsOptions) {
        this.icon = options.icon;
        this.character = options.character;
    }
}
