// eslint-disable-next-line max-classes-per-file
import { customElement } from '@microsoft/fast-element';
import { RichTextMention } from '..';
import type { Mapping } from '../../../mapping/base';
import { MappingUser } from '../../../mapping/user';
import { richTextMentionUsersViewTag } from '../../users/view';
import { MappingConfig } from '../models/mapping-config';
import type {
    MentionInternals,
    MentionInternalsOptions
} from '../models/mention-internals';
import { RichTextMentionValidator } from '../models/mention-validator';
import type { MappingConfigs, RichTextMentionConfig } from '../types';

export const richTextMentionTestTag = 'nimble-rich-text-test-mention';

/**
 * validator for testing
 */
export class RichTextMentionTestValidator extends RichTextMentionValidator<[]> {
    public constructor(columnInternals: MentionInternals<unknown>) {
        super(columnInternals, [], []);
    }
}

/**
 * Basic MappingConfig for testing
 */
export class MappingTestConfig extends MappingConfig {}

/**
 * Simple rich text mention for testing
 */
@customElement({
    name: richTextMentionTestTag
})
export class RichTextMentionTest extends RichTextMention {
    public override getMentionedHrefs(): string[] {
        const regex = new RegExp(this.pattern ?? '');
        return this.richTextParent
            .getMentionedHrefs()
            .filter(x => regex.test(x));
    }

    protected override createValidator(): RichTextMentionTestValidator {
        return new RichTextMentionTestValidator(this.mentionInternals);
    }

    protected override getMentionInternalsOptions(): MentionInternalsOptions {
        return {
            icon: '',
            character: '!',
            viewElement: richTextMentionUsersViewTag,
            name: 'test',
            key: 'test'
        };
    }

    protected override createMentionConfig(
        mappingConfigs: MappingConfigs
    ): RichTextMentionConfig {
        return {
            mappingConfigs
        };
    }

    protected createMappingConfig(mapping: Mapping<unknown>): MappingConfig {
        if (mapping instanceof MappingUser) {
            return new MappingTestConfig(mapping.key, mapping.displayName);
        }
        throw new Error('Unsupported mapping');
    }
}
