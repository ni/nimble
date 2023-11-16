import { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';
import type { UnitTranslation } from './unit-translation';

/**
 * A scaled unit that is not supported by Intl.NumberFormat and must have translations built into Nimble
 */
export class ManuallyTranslatedScaledUnit extends ScaledUnit {
    public readonly formatterOptions: Intl.NumberFormatOptions = {};

    public constructor(
        scaleFactor: number,
        private readonly unitTranslations: ReadonlyMap<string, UnitTranslation>,
        private readonly unitPrefix: string | undefined = undefined
    ) {
        super(scaleFactor);
    }

    public override appendUnitIfNeeded(
        formattedNumber: string,
        rawNumber: number,
        locale: string,
        pluralRules: Intl.PluralRules
    ): string {
        const translation = this.getTranslationToUse(locale);
        if (this.unitPrefix) {
            return `${formattedNumber} ${this.unitPrefix}${translation.symbol}`;
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
        const singular = pluralRules.select(rawNumber) === 'one';
        const toAppend = singular ? translation.singular : translation.plural;
        return `${formattedNumber} ${toAppend}`;
    }

    private getTranslationToUse(locale: string): UnitTranslation {
        const localeObject = new Intl.Locale(locale);
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
