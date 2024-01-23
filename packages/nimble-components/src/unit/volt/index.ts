import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { voltUnitScale } from '../../utilities/unit-format/unit-scale/volt-unit-scale';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-volt': UnitVolt;
    }
}

/**
 * Element representing units for volts
 */
export class UnitVolt extends Unit {
    public constructor() {
        super();
        this.resolvedUnitScale = voltUnitScale;
    }
}

const nimbleUnitVolt = UnitVolt.compose({
    baseName: 'unit-volt',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitVolt());
export const unitVoltTag = 'nimble-unit-volt';
