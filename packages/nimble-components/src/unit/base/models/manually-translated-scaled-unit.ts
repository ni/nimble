import { UnitFormatter } from '../../../table-column/number-text/models/scaled-unit';
import type { UnitTranslation } from './unit-translation';

/**
 * A scaled unit that is not supported by Intl.NumberFormat and must have translations built into Nimble
 */
export class ManuallyTranslatedScaledUnitFormatter extends UnitFormatter {
    private readonly pluralRules: Intl.PluralRules;
    private readonly formatter: Intl.NumberFormat;
    private readonly unitTranslation: UnitTranslation;

    public constructor(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions | undefined,
        private readonly unitTranslations: ReadonlyMap<string, UnitTranslation>,
        private readonly unitPrefix: string | undefined = undefined
    ) {
        super();

        this.pluralRules = new Intl.PluralRules(locale);
        this.formatter = new Intl.NumberFormat(locale, formatterOptions);
        this.unitTranslation = this.getTranslationToUse(locale);
    }

    public format(value: number): string {
        const formatted = this.formatter.format(value);
        if (this.unitPrefix) {
            return `${formatted} ${this.unitPrefix}${this.unitTranslation.symbol}`;
        }

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
            ? this.unitTranslation.singular
            : this.unitTranslation.plural;
        return `${formatted} ${unitLabel}`;
    }

    private getTranslationToUse(locale: string): UnitTranslation {
        const localeObject = new Intl.Locale(locale ?? '');
        const language = localeObject.language;
        const region = localeObject.region;
        const languageAndRegion = `${language}-${region?.toUpperCase() ?? ''}`;
        return (
            this.unitTranslations.get(languageAndRegion)
            ?? this.unitTranslations.get(language)
            ?? this.unitTranslations.get('en')!
        );
    }
}
