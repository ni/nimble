import type { ValidityObject } from '../../../table/types';
import type { ColumnInternals } from './column-internals';

type ObjectFromList<T extends readonly string[], V = string> = {
    [K in T extends readonly (infer U)[] ? U : never]: V;
};

/**
 * Base column validator
 */
export class ColumnValidator<ValidityFlagNames extends readonly string[]> {
    protected configValidity: ObjectFromList<ValidityFlagNames, boolean>;

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

    public isValid(): boolean {
        return Object.values(this.configValidity).every(x => !x);
    }

    public getValidity(): ValidityObject {
        return {
            ...this.configValidity
        };
    }

    protected setConditionValue(
        name: ValidityFlagNames extends readonly (infer U)[] ? U : never,
        isInvalid: boolean
    ): boolean {
        this.configValidity[name] = isInvalid;
        this.updateColumnInternalsFlag();
        return !isInvalid;
    }

    private updateColumnInternalsFlag(): void {
        this.columnInternals.validConfiguration = Object.values(
            this.configValidity
        ).every(x => !x);
    }
}
