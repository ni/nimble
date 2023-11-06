import { MappingMentionUser } from '../../../mapping/mention-user';
import type { MentionInternals } from '../../base/models/mention-internals';
import { baseValidityFlagNames, RichTextMentionBaseValidator } from '../../mention-base/models/rich-text-mention-base-validator';

const usersValidityFlagNames = [...baseValidityFlagNames, 'missingDisplayNameValue'] as const;

/**
 * Validator for RichtextMentionUsers
 */
export class RichTextMentionUsersValidator extends RichTextMentionBaseValidator<typeof usersValidityFlagNames> {
    public constructor(columnInternals: MentionInternals<unknown>) {
        super(columnInternals, usersValidityFlagNames, [MappingMentionUser]);
    }
}