import { FoundationElement } from '@microsoft/fast-foundation';

export interface Unit {
    conversionFactor: number;
    format(value: number): string;
}

/**
 * TODO
 */
export abstract class UnitFamily extends FoundationElement {
    public abstract getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): Unit[];
}
