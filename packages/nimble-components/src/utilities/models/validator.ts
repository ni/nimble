import { Tracker } from './tracker';

/**
 * Generic Validator Utility extends Tracker Utility for validation purposes
 */
export class Validator<
    ValidationFlags extends readonly string[]
> extends Tracker<ValidationFlags> {
    public constructor(validationFlags: ValidationFlags) {
        super(validationFlags);
    }

    public isValid(): boolean {
        return this.noneTracked();
    }

    public getValidationFlags(): typeof this.trackedItems {
        return this.trackedItems;
    }
}
