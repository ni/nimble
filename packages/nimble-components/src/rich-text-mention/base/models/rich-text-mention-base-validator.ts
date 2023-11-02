import type { MappingMentionBase } from '../../../mapping/mention base';
import type { MentionInternals } from './mention-internals';
import { MentionValidator } from './mention-validator';

export const baseValidityFlagNames = [
    'unsupportedMappingType',
    'duplicateMappingMentionUrls',
    'missingMentionUrlValue',
    'missingPatternAttribute',
] as const;

/**
 * Validator for RichTextmentionBase
 */
export abstract class RichTextMentionBaseValidator<
    ValidityFlagNames extends readonly string[]
> extends MentionValidator<
typeof baseValidityFlagNames | ValidityFlagNames
    > {
    public constructor(
        mentionInternals: MentionInternals<unknown>,
        configValidityKeys: ValidityFlagNames,
        private readonly supportedMappingElements: readonly (typeof MappingMentionBase)[]
    ) {
        super(mentionInternals, configValidityKeys);
    }

    public validate(mappings: MappingMentionBase[], pattern: string): void {
        this.untrackAll();
        const mentionUrls = mappings.map(mapping => mapping.mentionUrl);
        this.validateMappingTypes(mappings);
        this.validateUniqueMentionUrls(mentionUrls);
        this.validateNoMissingMentionUrls(mappings);
        this.validatePattern(pattern);
    }

    private validatePattern(pattern: string): void {
        this.setConditionValue('missingPatternAttribute', pattern === undefined);
    }

    private validateMappingTypes(mappings: MappingMentionBase[]): void {
        const valid = mappings.every(mapping => this.supportedMappingElements.some(
            mappingClass => mapping instanceof mappingClass
        ));
        this.setConditionValue('unsupportedMappingType', !valid);
    }

    private validateUniqueMentionUrls(
        mentionUrls: (string | undefined)[],
    ): void {
        const typedKeys = mentionUrls.map(x => x?.toString() ?? undefined);
        const invalid = new Set(typedKeys).size !== typedKeys.length;
        this.setConditionValue('duplicateMappingMentionUrls', invalid);
    }

    private validateNoMissingMentionUrls(mappings: MappingMentionBase[]): void {
        const invalid = mappings.some(mapping => mapping.mentionUrl === undefined);
        this.setConditionValue('missingMentionUrlValue', invalid);
    }
}