import type { TableColumnValidity } from '../types';
import type { ColumnInternals } from './column-internals';

type ObjectFromList<T extends readonly string[]> = {
    [K in T extends readonly (infer U)[] ? U : never]: boolean;
};

/**
 * Base column validator
 */
export class ColumnValidator<ValidityFlagNames extends readonly string[]> {
    protected configValidity: ObjectFromList<ValidityFlagNames>;

    public constructor(
        private readonly columnInternals: ColumnInternals<unknown>,
        configValidityKeys: ValidityFlagNames
    ) {
        type ConfigValidity = typeof this.configValidity;
        this.configValidity = configValidityKeys.reduce(
            (r, key): ConfigValidity => {
                return {
                    ...r,
                    [key]: false
                };
            },
            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
            {} as ConfigValidity
        );
    }

    /**
     * @returns whether the entire column configuration is valid
     */
    public isValid(): boolean {
        return Object.values(this.configValidity).every(x => !x);
    }

    /**
     * @returns an object containing flags for various ways the configuation can be invalid
     */
    public getValidity(): TableColumnValidity {
        return {
            ...this.configValidity
        };
    }

    /**
     * Sets a particular validity condition flag's value, e.g. "hasInvalidFooValue" = true
     */
    protected setConditionValue(
        name: ValidityFlagNames extends readonly (infer U)[] ? U : never,
        isInvalid: boolean
    ): void {
        this.configValidity[name] = isInvalid;
        this.updateColumnInternalsFlag();
    }

    private updateColumnInternalsFlag(): void {
        this.columnInternals.validConfiguration = this.isValid();
    }
}
