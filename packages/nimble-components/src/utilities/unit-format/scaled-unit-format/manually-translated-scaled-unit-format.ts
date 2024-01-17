/* eslint-disable max-classes-per-file */
import type { ScaledUnitFormatFactoryOptions } from '../scaled-unit/scaled-unit';
import { ScaledUnitFormat } from './scaled-unit-format';

/**
 * Representations of a unit in a particular language
 */
export class UnitTranslation {
    public constructor(
        public readonly singular: string,
        public readonly plural: string,
        public readonly symbol: string
    ) { }
}
/**
 * A map of locales of string format "[lang]" or "[lang]-[region]", for example "en" and / or "en-us", to UnitTranslation objects
 */
export type UnitTranslations = ReadonlyMap<string, UnitTranslation>;
export interface ManuallyTranslatedScaledUnitFormatOptions {
    /**
     * Translations for the unit by locale string.
     * The locale strings must be of the form [lang] or [lang]-[region], for example "en" and / or "en-us".
     * Other subtags besides lang and region are not supported.
     * Translations for "en" must be provided.
     */
    readonly unitTranslations: UnitTranslations;
    /**
     * String for prefix of this scaled unit, for example "k" (for kilo-).
     * Assumed the same across languages.
     * Base unit must use "", i.e. empty string, as the scaled prefix text.
     */
    readonly scaledPrefixText: string;
}

/**
 * A formatter for units that are not supported by Intl.NumberFormat
 */
export class ManuallyTranslatedScaledUnitFormat extends ScaledUnitFormat {
    private readonly pluralRules: Intl.PluralRules;
    private readonly formatter: Intl.NumberFormat;
    private readonly unitTranslation: UnitTranslation;
    private readonly scaledPrefixText: string;

    protected constructor(
        scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions,
        { unitTranslations, scaledPrefixText }: ManuallyTranslatedScaledUnitFormatOptions
    ) {
        super(scaledUnitFormatFactoryOptions);
        if (!unitTranslations.get('en')) {
            throw new Error('English translations must exist with locale string "en"');
        }
        this.pluralRules = new Intl.PluralRules(this.locale);
        this.formatter = new Intl.NumberFormat(
            this.locale,
            this.intlNumberFormatOptions
        );
        this.unitTranslation = this.getTranslationToUse(unitTranslations, this.locale);
        this.scaledPrefixText = scaledPrefixText;
    }

    public static createFactory(
        manuallyTranslatedScaledUnitFormatOptions: ManuallyTranslatedScaledUnitFormatOptions
    ) {
        return (
            scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions
        ): ManuallyTranslatedScaledUnitFormat => new ManuallyTranslatedScaledUnitFormat(
            scaledUnitFormatFactoryOptions,
            manuallyTranslatedScaledUnitFormatOptions
        );
    }

    public format(value: number): string {
        const formatted = this.formatter.format(value);
        // The base unit has text of empty string
        if (this.scaledPrefixText === '') {
            return `${formatted} ${this.scaledPrefixText}${this.unitTranslation.symbol}`;
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
        const unitLabel = this.pluralRules.select(value) === 'one'
            ? this.unitTranslation.singular
            : this.unitTranslation.plural;
        return `${formatted} ${unitLabel}`;
    }

    private getTranslationToUse(unitTranslations: UnitTranslations, locale: string): UnitTranslation {
        const localeObject = new Intl.Locale(locale ?? 'en');
        const language = localeObject.language;
        const region = localeObject.region;
        const regionSpecificMatchedTranslations = region
            ? unitTranslations.get(`${language}-${region}`)
            : undefined;
        return (
            regionSpecificMatchedTranslations
            ?? unitTranslations.get(language)
            ?? unitTranslations.get('en')!
        );
    }
}
