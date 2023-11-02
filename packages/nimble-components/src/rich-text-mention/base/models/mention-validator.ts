import { Validator, ValidityObject } from '../../../utilities/models/validator';
import type { MentionInternals } from './mention-internals';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RichTextMentionValidity extends ValidityObject {}

/**
 * Base Mention validator
 */
export class MentionValidator<
    ValidityFlagNames extends readonly string[]
> extends Validator<ValidityFlagNames> {
    public constructor(
        private readonly mentionInternals: MentionInternals<unknown>,
        configValidityKeys: ValidityFlagNames
    ) {
        super(configValidityKeys);
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
        name: ValidityFlagNames extends readonly (infer U)[] ? U : never,
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
}