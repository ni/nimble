import { ManuallyTranslatedScaledUnitFormatter } from './manually-translated-scaled-unit';
import type { ScaledUnit } from './scaled-unit';
import type { UnitPrefix } from './unit-prefix';
import type { UnitTranslation } from './unit-translation';
import { UnitScale } from './unit-scale';

/**
 * A unit scale that is not supported by Intl.NumberFormat and has translations built into Nimble
 */
export abstract class ManuallyTranslatedUnitScale extends UnitScale {
    private readonly unitTranslations: ReadonlyMap<string, UnitTranslation>;
    private readonly supportedPrefixes: readonly UnitPrefix[];

    public constructor() {
        super();
        this.unitTranslations = this.getUnitTranslations();
        this.supportedPrefixes = this.getSupportedPrefixes();
        if (!this.unitTranslations.get('en')) {
            throw new Error('English translations must exist');
        }
    }

    protected override getSupportedScaledUnits(): ScaledUnit[] {
        const supportedUnits: ScaledUnit[] = [
            {
                scaleFactor: 1,
                unitFormatterFactory: (
                    locale: string,
                    numberFormatOptions: Intl.NumberFormatOptions | undefined
                ) => {
                    return new ManuallyTranslatedScaledUnitFormatter(
                        locale,
                        numberFormatOptions,
                        this.unitTranslations
                    );
                }
            }
        ];
        for (const prefix of this.supportedPrefixes) {
            supportedUnits.push({
                scaleFactor: prefix.factor,
                unitFormatterFactory: (
                    locale: string,
                    numberFormatOptions: Intl.NumberFormatOptions | undefined
                ) => {
                    return new ManuallyTranslatedScaledUnitFormatter(
                        locale,
                        numberFormatOptions,
                        this.unitTranslations,
                        prefix.text
                    );
                }
            });
        }
        return supportedUnits;
    }

    protected abstract getUnitTranslations(): ReadonlyMap<
    string,
    UnitTranslation
    >;
    protected abstract getSupportedPrefixes(): readonly UnitPrefix[];
}
