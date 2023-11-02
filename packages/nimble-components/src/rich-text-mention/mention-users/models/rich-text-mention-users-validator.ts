import { MappingMentionFinal } from '../../../mapping/mention final';
import type { MentionInternals } from '../../base/models/mention-internals';
import { baseValidityFlagNames, RichTextMentionBaseValidator } from '../../base/models/rich-text-mention-base-validator';

const usersValidityFlagNames = [...baseValidityFlagNames, 'missingDisplayNameValue'] as const;

/**
 * Validator for RichtextMentionUsers
 */
export class RichTextMentionUsersValidator extends RichTextMentionBaseValidator<typeof usersValidityFlagNames> {
    public constructor(columnInternals: MentionInternals<unknown>) {
        super(columnInternals, usersValidityFlagNames, [MappingMentionFinal]);
    }

    public override validate(mappings: MappingMentionFinal[], pattern: string): void {
        super.validate(mappings, pattern);
        this.validateNoMissingDisplayName(mappings);
    }

    private validateNoMissingDisplayName(mappings: MappingMentionFinal[]): void {
        const invalid = mappings.some(mapping => mapping.displayName === undefined);
        this.setConditionValue('missingDisplayNameValue', invalid);
    }
}