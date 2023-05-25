import type { ValidityObject } from '../../table/types';
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

    public getValidationFlags(): ValidityObject {
        return this.trackedItems;
    }
}
