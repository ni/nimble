import type { UnitFormatter, UnitFormatterFactoryFunction } from './scaled-unit';

/**
 * A class that caches a UnitFormatter instance for a given scale factor.
 */
export class UnitFormatterCache {
    private readonly formatterCache = new Map<
    number,
    UnitFormatter
    >();

    public constructor(private readonly locale: string, private readonly formatterOptions: Intl.NumberFormatOptions) { }

    public getOrCreateUnitFormatter(scaleFactor: number, factoryFunction: UnitFormatterFactoryFunction): UnitFormatter {
        const cachedFormatter = this.formatterCache.get(scaleFactor);
        if (cachedFormatter) {
            return cachedFormatter;
        }

        const createdFormatter = factoryFunction(this.locale, this.formatterOptions);
        this.formatterCache.set(scaleFactor, createdFormatter);
        return createdFormatter;
    }
}
