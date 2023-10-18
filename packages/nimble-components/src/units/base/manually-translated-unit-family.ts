import { ManuallyTranslatedUnit } from './manually-translated-unit';
import { Unit, UnitFamily } from './unit-family';
import type { UnitPrefix } from './unit-prefix';
import type { UnitTranslation } from './unit-translation';

/**
 * A family of units that are not supported by Intl.NumberFormat and have translations hard-coded in Nimble
 */
export abstract class ManuallyTranslatedUnitFamily extends UnitFamily {
    private readonly unitTranslations: Map<string, UnitTranslation>;
    private readonly supportedPrefixes: UnitPrefix[];

    public constructor() {
        super();
        this.unitTranslations = this.getUnitTranslations();
        this.supportedPrefixes = this.getSupportedPrefixes();
        if (!this.unitTranslations.get('en')) {
            throw new Error('English translations must exist');
        }
    }

    public getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): Unit[] {
        const commonFormatter = new Intl.NumberFormat(lang, formatterOptions);
        const commonPluralRules = new Intl.PluralRules(lang);
        const language = new Intl.Locale(lang).language;
        const translations = this.unitTranslations.has(language)
            ? this.unitTranslations.get(language)!
            : this.unitTranslations.get('en')!;
        const supportedUnits: Unit[] = [
            new ManuallyTranslatedUnit(
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
                new ManuallyTranslatedUnit(
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
