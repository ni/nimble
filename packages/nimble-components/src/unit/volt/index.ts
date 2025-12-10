import { DesignSystem } from '@ni/fast-foundation';
import { voltUnitScale } from '@ni/unit-format/unit-scale/volt';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { styles } from '../base/styles';

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
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitVolt());
export const unitVoltTag = 'nimble-unit-volt';
