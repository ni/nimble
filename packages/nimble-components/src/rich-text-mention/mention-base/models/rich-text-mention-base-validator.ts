import type { MappingMentionBase } from '../../../mapping/mention-base';
import { Validator, ValidityObject } from '../../../utilities/models/validator';
import type { MentionInternals } from './mention-internals';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RichTextMentionValidity extends ValidityObject {}

export const baseValidityFlagNames = [
    'unsupportedMappingType',
    'duplicateMappingMentionHref',
    'missingMentionHrefValue',
    'unsupportedMentionHrefValue',
    'missingDisplayNameValue',
    'missingPatternAttribute'
] as const;

/**
 * Validator for RichTextMention
 */
export class RichTextMentionValidator<
    ValidityFlagNames extends readonly string[]
> extends Validator<typeof baseValidityFlagNames | ValidityFlagNames > {
    public constructor(
        private readonly mentionInternals: MentionInternals<unknown>,
        configValidityKeys: ValidityFlagNames,
        private readonly supportedMappingElements: readonly (typeof MappingMentionBase)[]
    ) {
        super(configValidityKeys);
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
        name: typeof baseValidityFlagNames extends readonly (infer U)[] ? U : never | ValidityFlagNames extends readonly (infer U)[] ? U : never,
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
        const invalid = new Set(mentionHref).size !== mentionHref.length;
        this.setConditionValue('duplicateMappingMentionHref', invalid);
    }

    private validateNoMissingMentionHref(mappings: MappingMentionBase[]): void {
        const invalid = mappings.some(
            mapping => mapping.mentionHref === undefined
        );
        this.setConditionValue('missingMentionHrefValue', invalid);
    }

    private validateHref(
        mentionHrefs: (string | undefined)[],
        pattern: string | undefined
    ): void {
        const regexPattern = new RegExp(pattern!);
        const valid = mentionHrefs.every(href => href === undefined || regexPattern.test(href));
        this.setConditionValue('unsupportedMentionHrefValue', !valid);
    }

    private validateNoMissingDisplayName(mappings: MappingMentionBase[]): void {
        const invalid = mappings.some(
            mapping => mapping.displayName === undefined
        );
        this.setConditionValue('missingDisplayNameValue', invalid);
    }
}
