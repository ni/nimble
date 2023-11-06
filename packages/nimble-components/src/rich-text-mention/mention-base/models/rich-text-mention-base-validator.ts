import type { MappingMentionBase } from '../../../mapping/mention-base';
import type { MentionInternals } from '../../base/models/mention-internals';
import { MentionValidator } from '../../base/models/mention-validator';

export const baseValidityFlagNames = [
    'unsupportedMappingType',
    'duplicateMappingMentionHref',
    'missingMentionHrefValue',
    'unsupportedMentionHrefValue',
    'missingDisplayNameValue',
    'missingPatternAttribute'
] as const;

/**
 * Validator for RichTextmentionBase
 */
export abstract class RichTextMentionBaseValidator<
    ValidityFlagNames extends readonly string[]
> extends MentionValidator<typeof baseValidityFlagNames | ValidityFlagNames> {
    public constructor(
        mentionInternals: MentionInternals<unknown>,
        configValidityKeys: ValidityFlagNames,
        private readonly supportedMappingElements: readonly (typeof MappingMentionBase)[]
    ) {
        super(mentionInternals, configValidityKeys);
    }

    public validate(
        mappings: MappingMentionBase[],
        pattern: string | undefined
    ): void {
        this.untrackAll();
        const mentionHrefs = mappings.map(mapping => mapping.mentionHref);
        this.validateMappingTypes(mappings);
        this.validateNoMissingDisplayName(mappings);
        this.validateNoMissingMentionHref(mappings);
        this.validateUniqueMentionHref(mentionHrefs);
        this.validatePattern(pattern);
        this.validateHref(mentionHrefs, pattern);
    }

    private validatePattern(pattern: string | undefined): void {
        this.setConditionValue(
            'missingPatternAttribute',
            pattern === undefined
        );
    }

    private validateMappingTypes(mappings: MappingMentionBase[]): void {
        const valid = mappings.every(mapping => this.supportedMappingElements.some(
            mappingClass => mapping instanceof mappingClass
        ));
        this.setConditionValue('unsupportedMappingType', !valid);
    }

    private validateUniqueMentionHref(
        mentionHref: (string | undefined)[]
    ): void {
        const typedKeys = mentionHref.map(x => x?.toString() ?? undefined);
        const invalid = new Set(typedKeys).size !== typedKeys.length;
        this.setConditionValue('duplicateMappingMentionHref', invalid);
    }

    private validateNoMissingMentionHref(mappings: MappingMentionBase[]): void {
        const invalid = mappings.some(
            mapping => mapping.mentionHref === undefined
        );
        this.setConditionValue('missingMentionHrefValue', invalid);
    }

    private validateHref(
        mappings: (string | undefined)[],
        pattern: string | undefined
    ): void {
        const regexPattern = new RegExp(pattern!);
        const valid = mappings.some(href => (href ? regexPattern.test(href) : false));
        this.setConditionValue('unsupportedMentionHrefValue', !valid);
    }

    private validateNoMissingDisplayName(mappings: MappingMentionBase[]): void {
        const invalid = mappings.some(
            mapping => mapping.displayName === undefined
        );
        this.setConditionValue('missingDisplayNameValue', invalid);
    }
}
