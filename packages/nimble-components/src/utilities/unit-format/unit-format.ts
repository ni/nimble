import type { UnitScale } from './unit-scale/unit-scale';

export interface UnitFormatOptions {
    unitScale?: UnitScale;
}

/**
 * The base class for unit formats.
 */
export abstract class UnitFormat<
    Options extends UnitFormatOptions = UnitFormatOptions
> {
    /**
     * Formats a number value to a string.
     * For nullish values or values that result in an exception being thrown, empty string is returned
     */
    public format(value: number | undefined | null): string {
        if (typeof value !== 'number') {
            return '';
        }

        try {
            return this.tryFormat(value);
        } catch {
            return '';
        }
    }

    public abstract resolvedOptions(): Required<Options>;

    protected abstract tryFormat(number: number): string;
}
