import type { ValidityObject } from '../../../table/types';

/**
 * Base column validator
 */
export class ColumnValidator {
    protected configValidity: ValidityObject;

    public constructor(configValidityKeys: string[]) {
        this.configValidity = {} as ValidityObject;
        for (const key of configValidityKeys) {
            this.configValidity[key] = false;
        }
    }

    public isValid(): boolean {
        return Object.values(this.configValidity).every(x => !x);
    }

    public getValidity(): ValidityObject {
        const validity = {} as ValidityObject;
        for (const key of Object.keys(this.configValidity)) {
            validity[key] = this.configValidity[key]!;
        }
        return validity;
    }
}
