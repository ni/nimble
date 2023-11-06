import { observable } from '@microsoft/fast-element';

export interface MentionInternalsOptions{
    readonly icon: string;
    readonly character: string;
    readonly pattern: string;
}

/**
 * Internal mention state
 */
export class MentionInternals<TMentionConfig> {
    /**
     * The relevant, static configuration which will hold mentioning info of view, character, icon and pattern
     */
    @observable
    public mentionConfig?: TMentionConfig;

    /**
     * Whether this mention has a valid configuration.
     */
    @observable
    public validConfiguration = true;

    public readonly icon: string;

    public readonly character: string;

    public readonly pattern: string;

    public constructor(options: MentionInternalsOptions) {
        this.icon = options.icon;
        this.character = options.character;
        this.pattern = options.pattern;
    }
}