import type { Mapping } from '../../../mapping/base';
import type { MentionHref } from '../../../mapping/base/types';
import { MappingMentionUser } from '../../../mapping/mention-user';
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
    public constructor(columnInternals: MentionInternals<unknown>) {
        super(columnInternals, usersValidityFlagNames, [MappingMentionUser]);
    }

    public override validate(
        mappings: Mapping<MentionHref>[],
        pattern: string
    ): void {
        super.validate(mappings, pattern);
        this.validateNoMissingDisplayName(mappings);
    }

    private validateNoMissingDisplayName(mappings: MappingMentionUser[]): void {
        const invalid = mappings.some(
            mapping => mapping.displayName === undefined
        );
        this.setConditionValue('missingDisplayNameValue', invalid);
    }
}
