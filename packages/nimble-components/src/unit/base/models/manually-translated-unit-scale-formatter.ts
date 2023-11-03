import { ManuallyTranslatedScaledUnit } from './manually-translated-scaled-unit';
import type { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';
import type { UnitPrefix } from './unit-prefix';
import type { UnitTranslation } from './unit-translation';
import { UnitScaleFormatter } from '../../../table-column/number-text/models/unit-scale-formatter';

/**
 * A formatter for a unit scale that is not supported by Intl.NumberFormat and has translations built into Nimble
 */
export abstract class ManuallyTranslatedUnitScaleFormatter extends UnitScaleFormatter {
    private readonly unitTranslations: ReadonlyMap<string, UnitTranslation>;
    private readonly supportedPrefixes: readonly UnitPrefix[];

    public constructor(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions
    ) {
        super(locale, formatterOptions);
        this.unitTranslations = this.getUnitTranslations();
        this.supportedPrefixes = this.getSupportedPrefixes();
        if (!this.unitTranslations.get('en')) {
            throw new Error('English translations must exist');
        }
    }

    protected override getSupportedScaledUnits(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[] {
        const commonFormatter = new Intl.NumberFormat(locale, formatterOptions);
        const commonPluralRules = new Intl.PluralRules(locale);
        const localeObject = new Intl.Locale(locale);
        const language = localeObject.language;
        const region = localeObject.region;
        const languageAndRegion = `${language}-${region?.toUpperCase() ?? ''}`;
        const translations = this.unitTranslations.get(languageAndRegion)
            ?? this.unitTranslations.get(language)
            ?? this.unitTranslations.get('en')!;
        const supportedUnits: ScaledUnit[] = [
            new ManuallyTranslatedScaledUnit(
                1,
                commonFormatter,
                commonPluralRules,
                translations.plural,
                translations.singular
            )
        ];
        for (const prefix of this.supportedPrefixes) {
            const label = `${prefix.text}${translations.symbol}`;
            supportedUnits.push(
                new ManuallyTranslatedScaledUnit(
                    prefix.factor,
                    commonFormatter,
                    commonPluralRules,
                    label,
                    label
                )
            );
        }
        return supportedUnits;
    }

    protected abstract getUnitTranslations(): ReadonlyMap<
    string,
    UnitTranslation
    >;
    protected abstract getSupportedPrefixes(): readonly UnitPrefix[];
}
