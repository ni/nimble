import { Tracker } from './tracker';

export interface ValidityObject {
    [key: string]: boolean;
}

/**
 * Generic Validator Utility extends Tracker Utility for validation purposes
 */
export class Validator<
    ValidationFlags extends readonly string[]
> extends Tracker<ValidationFlags> {
    public isValid(): boolean {
        return this.noneTracked();
    }

    public getValidationFlags(): ValidityObject {
        return this.getTrackedItems();
    }
}
