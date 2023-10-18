import { FoundationElement } from '@microsoft/fast-foundation';

export interface Unit {
    conversionFactor: number;
    format(value: number): string;
}

/**
 * An element representing a set of related units which could be used to represent the same value
 */
export abstract class UnitFamily extends FoundationElement {
    public abstract getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): Unit[];
}
