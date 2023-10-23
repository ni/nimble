import { ManuallyTranslatedScaledUnit } from './manually-translated-scaled-unit';
import type { ScaledUnit } from './scaled-unit';
import type { UnitPrefix } from './unit-prefix';
import type { UnitTranslation } from './unit-translation';
import { UnitScaleFormatter } from './unit-scale-formatter';

/**
 * A unit scale that is not supported by Intl.NumberFormat and has translations hard-coded in Nimble
 */
export abstract class ManuallyTranslatedUnitScaleFormatter extends UnitScaleFormatter {
    private readonly unitTranslations: Map<string, UnitTranslation>;
    private readonly supportedPrefixes: UnitPrefix[];

    public constructor(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ) {
        super(lang, formatterOptions);
        this.unitTranslations = this.getUnitTranslations();
        this.supportedPrefixes = this.getSupportedPrefixes();
        if (!this.unitTranslations.get('en')) {
            throw new Error('English translations must exist');
        }
    }

    protected override getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[] {
        const commonFormatter = new Intl.NumberFormat(lang, formatterOptions);
        const commonPluralRules = new Intl.PluralRules(lang);
        const language = new Intl.Locale(lang).language;
        const translations = this.unitTranslations.has(language)
            ? this.unitTranslations.get(language)!
            : this.unitTranslations.get('en')!;
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

    protected abstract getUnitTranslations(): Map<string, UnitTranslation>;
    protected abstract getSupportedPrefixes(): UnitPrefix[];
}
