import type { RichTextMention } from '../../../rich-text-mention/base';
import type { RichTextValidity } from '../types';

/**
 * Helper class for the nimble rich text components to validate that the configuration
 * is valid and report which aspects of the configuration are valid or invalid.
 */
export class RichTextValidator {
    private invalidMentionConfiguration = false;
    private duplicateMentionConfiguration = false;

    public getValidity(): RichTextValidity {
        return {
            invalidMentionConfiguration: this.invalidMentionConfiguration,
            duplicateMentionConfiguration: this.duplicateMentionConfiguration
        };
    }

    public isValid(): boolean {
        return Object.values(this.getValidity()).every(x => x === false);
    }

    public validate(mentions: RichTextMention[]): void {
        this.validateDuplicateMentionConfigurations(mentions);
        this.validateMentionConfigurations(mentions);
    }

    public validateMentionConfigurations(mentions: RichTextMention[]): boolean {
        this.invalidMentionConfiguration = mentions.some(
            x => !x.mentionInternals.validConfiguration
        );
        return !this.invalidMentionConfiguration;
    }

    public validateDuplicateMentionConfigurations(
        mentions: RichTextMention[]
    ): boolean {
        const mentionChars = mentions.map(
            mention => mention.mentionInternals.character
        );
        const uniqueMentionChars = new Set(mentionChars);
        this.duplicateMentionConfiguration = mentionChars.length !== uniqueMentionChars.size;
        return !this.duplicateMentionConfiguration;
    }
}
