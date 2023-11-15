import { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';

/**
 * A scaled unit that is not supported by Intl.NumberFormat and must have translations built into Nimble
 */
export class ManuallyTranslatedScaledUnit extends ScaledUnit {
    public constructor(
        scaleFactor: number,
        private readonly formatter: Intl.NumberFormat,
        private readonly pluralRules: Intl.PluralRules,
        private readonly unitLabel: string,
        private readonly singularUnitLabel: string
    ) {
        super(scaleFactor);
    }

    public format(value: number): string {
        const formatted = this.formatter.format(value);
        // Some languages have more than two forms (singular/plural) of cardinal
        // numbers, but we are treating anything other than the 'one' form as plural.
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules#description
        //
        // Because PluralRules.select() takes a number (not a string), it cannot differentiate
        // between 1 and 1.0. When NumberFormat is configured to format with a set number
        // of fractional digits, those fractional digits can have an effect on the pluralization
        // of the unit. E.g. in English, it formats "1 byte" vs "1.0 bytes". Thus there is
        // sometimes an inconsistency between unit pluralization for the same number, based
        // on whether it's supported by NumberFormat, or manually translated.
        const unitLabel = this.pluralRules.select(Number(formatted)) === 'one'
            ? this.singularUnitLabel
            : this.unitLabel;
        return `${formatted} ${unitLabel}`;
    }
}
