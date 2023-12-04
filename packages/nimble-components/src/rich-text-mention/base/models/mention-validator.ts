import type { Mapping } from '../../../mapping/base';
import { Validator, ValidityObject } from '../../../utilities/models/validator';
import type { MentionInternals } from './mention-internals';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RichTextMentionValidity extends ValidityObject {}

type FlagNames<T> = T extends readonly (infer U)[] ? U : never;

export const baseValidityFlagNames = [
    'unsupportedMappingType',
    'duplicateMappingMentionHref',
    'missingMentionHrefValue',
    'mentionHrefNotValidUrl',
    'mentionHrefDoesNotMatchPattern',
    'missingPatternAttribute',
    'unsupportedPatternValue'
] as const;

/**
 * Validator for RichTextMention
 */
export class RichTextMentionValidator<
    ValidityFlagNames extends readonly string[] = typeof baseValidityFlagNames
> extends Validator<typeof baseValidityFlagNames | ValidityFlagNames> {
    public constructor(
        private readonly mentionInternals: MentionInternals,
        configValidityKeys: ValidityFlagNames,
        private readonly supportedMappingElements: readonly (typeof Mapping<unknown>)[]
    ) {
        super(configValidityKeys);
    }

    public validate(
        mappings: Mapping<unknown>[],
        pattern: string | undefined
    ): void {
        this.untrackAll();
        const mentionHrefs = mappings.map(mapping => mapping.key);
        this.validateMappingTypes(mappings);
        this.validateNoMissingMentionHref(mentionHrefs);
        this.validateUniqueMentionHref(mentionHrefs);
        this.validateMissingPattern(pattern);
        this.validatePattern(pattern);
        this.validateHrefForPattern(mentionHrefs, pattern);
        this.validateHrefForUrl(mentionHrefs);
    }

    /**
     * @returns an object containing flags for various ways the configuation can be invalid
     */
    public getValidity(): RichTextMentionValidity {
        return this.getValidationFlags();
    }

    /**
     * Sets a particular validity condition flag's value, e.g. "hasInvalidFooValue" = true
     */
    protected setConditionValue(
        name: FlagNames<typeof baseValidityFlagNames | ValidityFlagNames>,
        isInvalid: boolean
    ): void {
        if (isInvalid) {
            this.track(name);
        } else {
            this.untrack(name);
        }
        this.updateMentionInternalsFlag();
    }

    private updateMentionInternalsFlag(): void {
        this.mentionInternals.validConfiguration = this.isValid();
    }

    private validateMissingPattern(pattern: string | undefined): void {
        this.setConditionValue(
            'missingPatternAttribute',
            pattern === undefined
        );
    }

    private validatePattern(pattern: string | undefined): void {
        this.setConditionValue(
            'unsupportedPatternValue',
            pattern === undefined || this.isInvalidRegex(pattern)
        );
    }

    // TODO move this to child class like done for table
    private validateMappingTypes(mappings: Mapping<unknown>[]): void {
        const valid = mappings.every(mapping => this.supportedMappingElements.some(
            mappingClass => mapping instanceof mappingClass
        ));
        this.setConditionValue('unsupportedMappingType', !valid);
    }

    private validateUniqueMentionHref(
        mentionHref: (string | undefined | unknown)[]
    ): void {
        const invalid = new Set(mentionHref).size !== mentionHref.length;
        this.setConditionValue('duplicateMappingMentionHref', invalid);
    }

    private validateNoMissingMentionHref(mentionHrefs: unknown[]): void {
        const invalid = mentionHrefs.some(href => href === undefined);
        this.setConditionValue('missingMentionHrefValue', invalid);
    }

    private validateHrefForUrl(mentionHrefs: unknown[]): void {
        const invalid = mentionHrefs.some(href => {
            return (
                href === undefined
                || typeof href !== 'string'
                || this.isInvalidUrl(href)
            );
        });
        this.setConditionValue('mentionHrefNotValidUrl', invalid);
    }

    private validateHrefForPattern(
        mentionHrefs: unknown[],
        pattern: string | undefined
    ): void {
        const invalid = pattern === undefined || this.isInvalidRegex(pattern)
            ? true
            : mentionHrefs.some(href => {
                return (
                    href === undefined
                          || typeof href !== 'string'
                          || !new RegExp(pattern).test(href)
                );
            });
        this.setConditionValue('mentionHrefDoesNotMatchPattern', invalid);
    }

    private isInvalidUrl(url: string): boolean {
        try {
            // eslint-disable-next-line no-new
            new URL(url);
            return false;
        } catch (error) {
            return true;
        }
    }

    private isInvalidRegex(pattern: string): boolean {
        try {
            // eslint-disable-next-line no-new
            new RegExp(pattern);
            return false;
        } catch (error) {
            return true;
        }
    }
}
