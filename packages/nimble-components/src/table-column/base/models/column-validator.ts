import { observable } from '@microsoft/fast-element';
import { Validator } from '../../../utilities/models/validator';
import type { TableColumnValidity } from '../types';

/**
 * Base column validator
 */
export class ColumnValidator<
    ValidityFlagNames extends readonly string[]
> extends Validator<ValidityFlagNames> {
    @observable
    public isColumnValid = true;

    public constructor(
        configValidityKeys: ValidityFlagNames
    ) {
        super(configValidityKeys);
    }

    /**
     * @returns an object containing flags for various ways the configuation can be invalid
     */
    public getValidity(): TableColumnValidity {
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
        this.updateIsColumnValidFlag();
    }

    private updateIsColumnValidFlag(): void {
        this.isColumnValid = this.isValid();
    }
}
