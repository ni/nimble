import { UnitFormatter } from './scaled-unit';

/**
 * A degenerate scaled unit that is used only by EmptyScaledUnitFormatter
 */
export class EmptyScaledUnitFormatter extends UnitFormatter {
    private readonly formatter: Intl.NumberFormat;

    public constructor(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions | undefined
    ) {
        super();
        this.formatter = new Intl.NumberFormat(locale, formatterOptions);
    }

    public format(value: number): string {
        return this.formatter.format(value);
    }
}