import { Tracker } from './tracker';

/**
 * Generic Validator Utility extends Tracker Utility
 */
export abstract class Validator<
    ValidationFlags extends readonly string[]
> extends Tracker<ValidationFlags> {
    public constructor(validationFlags: ValidationFlags) {
        super(validationFlags);
    }

    public isValid(): boolean {
        return this.allTracked();
    }
}
