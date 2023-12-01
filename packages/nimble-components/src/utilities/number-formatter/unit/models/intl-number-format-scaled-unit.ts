import { UnitFormatter } from './scaled-unit';

/**
 * A scaled unit that can be formatted/translated by Intl.NumberFormat
 */
export class IntlNumberFormatScaledUnitFormatter extends UnitFormatter {
    private readonly formatter: Intl.NumberFormat;

    public constructor(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions | undefined,
        unitFormatterOptions: Intl.NumberFormatOptions
    ) {
        super();
        this.formatter = new Intl.NumberFormat(locale, {
            ...unitFormatterOptions,
            ...formatterOptions
        });
    }

    public format(value: number): string {
        return this.formatter.format(value);
    }
}
