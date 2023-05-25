import { Validator } from '../../../utilities/models/validator';
import type { TableColumnValidity } from '../types';
import type { ColumnInternals } from './column-internals';

/**
 * Base column validator
 */
export class ColumnValidator<
    ValidityFlagNames extends readonly string[]
> extends Validator<ValidityFlagNames> {
    public constructor(
        private readonly columnInternals: ColumnInternals<unknown>,
        configValidityKeys: ValidityFlagNames
    ) {
        super(configValidityKeys);
    }

    /**
     * @returns whether the entire column configuration is valid
     */
    public isValidColumn(): boolean {
        return this.isValid();
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
        this.updateColumnInternalsFlag();
    }

    private updateColumnInternalsFlag(): void {
        this.columnInternals.validConfiguration = this.isValid();
    }
}
