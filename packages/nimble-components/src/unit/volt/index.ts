import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import type { UnitScale } from '../../utilities/number-formatter/unit-scale/base/unit-scale';
import { voltUnitScale } from '../../utilities/number-formatter/manually-translated-unit-scale/volt-unit-scale';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-volt': UnitVolt;
    }
}

/**
 * Element representing units for volts
 */
export class UnitVolt extends Unit {
    public override getUnitScale(): UnitScale {
        return voltUnitScale;
    }
}

const nimbleUnitVolt = UnitVolt.compose({
    baseName: 'unit-volt',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitVolt());
export const unitVoltTag = DesignSystem.tagFor(UnitVolt);
