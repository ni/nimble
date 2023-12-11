// eslint-disable-next-line max-classes-per-file
import { customElement, html, slotted } from '@microsoft/fast-element';
import { RichTextMention } from '..';
import type { Mapping } from '../../../mapping/base';
import { MappingUser } from '../../../mapping/user';
import { richTextMentionUsersViewTag } from '../../users/view';
import { MappingConfig } from '../models/mapping-config';
import type {
    MentionInternals,
    MentionInternalsOptions
} from '../models/mention-internals';
import {
    RichTextMentionValidator,
    baseValidityFlagNames
} from '../models/mention-validator';

export const richTextMentionTestTag = 'nimble-rich-text-test-mention';

/**
 * validator for testing
 */
class RichTextMentionTestValidator extends RichTextMentionValidator {
    public constructor(columnInternals: MentionInternals) {
        super(columnInternals, baseValidityFlagNames);
    }
}

/**
 * Basic MappingConfig for testing
 */
class MappingTestConfig extends MappingConfig {}

/**
 * Simple rich text mention for testing
 */
@customElement({
    name: richTextMentionTestTag,
    template: html<RichTextMention>`<slot
        ${slotted('mappingElements')}
        name="mapping"
    ></slot>`
})
export class RichTextMentionTest extends RichTextMention {
    protected override createValidator(): RichTextMentionTestValidator {
        return new RichTextMentionTestValidator(this.mentionInternals);
    }

    protected override getMentionInternalsOptions(): MentionInternalsOptions {
        return {
            icon: 'nimble-icon-at',
            character: '!',
            viewElement: richTextMentionUsersViewTag
        };
    }

    protected override getObservedMappingProperty(): string[] {
        return ['key', 'displayName'];
    }

    protected createMappingConfig(mapping: Mapping<unknown>): MappingConfig {
        if (mapping instanceof MappingUser) {
            return new MappingTestConfig(mapping.key, mapping.displayName);
        }
        throw new Error('Unsupported mapping');
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [richTextMentionTestTag]: RichTextMentionTest;
    }
}
