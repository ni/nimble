import { ManuallyTranslatedScaledUnit } from './manually-translated-scaled-unit';
import type { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';
import type { UnitPrefix } from './unit-prefix';
import type { UnitTranslation } from './unit-translation';
import { UnitScale } from '../../../table-column/number-text/models/unit-scale';

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
            new ManuallyTranslatedScaledUnit(1, this.unitTranslations)
        ];
        for (const prefix of this.supportedPrefixes) {
            supportedUnits.push(
                new ManuallyTranslatedScaledUnit(
                    prefix.factor,
                    this.unitTranslations,
                    prefix.text
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
