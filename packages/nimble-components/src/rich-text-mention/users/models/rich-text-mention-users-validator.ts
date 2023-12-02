import type { Mapping } from '../../../mapping/base';
import type { MappingUserKey } from '../../../mapping/base/types';
import { MappingUser } from '../../../mapping/user';
import type { MentionInternals } from '../../base/models/mention-internals';
import {
    baseValidityFlagNames,
    RichTextMentionValidator
} from '../../base/models/mention-validator';

const usersValidityFlagNames = [
    ...baseValidityFlagNames,
    'missingDisplayNameValue'
] as const;

/**
 * Validator for RichTextMentionUsers
 */
export class RichTextMentionUsersValidator extends RichTextMentionValidator<
    typeof usersValidityFlagNames
> {
    public constructor(columnInternals: MentionInternals) {
        super(columnInternals, usersValidityFlagNames, [MappingUser]);
    }

    public override validate(
        mappings: Mapping<MappingUserKey>[],
        pattern: string
    ): void {
        super.validate(mappings, pattern);
        this.validateNoMissingDisplayName(mappings);
    }

    private validateNoMissingDisplayName(mappings: MappingUser[]): void {
        const invalid = mappings.some(
            mapping => mapping.displayName === undefined
        );
        this.setConditionValue('missingDisplayNameValue', invalid);
    }
}
