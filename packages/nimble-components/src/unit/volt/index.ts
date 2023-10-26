import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import type { UnitScaleFormatterConstructor } from '../../table-column/number-text/models/unit-scale-formatter';
import { VoltUnitScaleFormatter } from './models/volt-unit-scale-formatter';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-volt': UnitVolt;
    }
}

/**
 * Element representing units for volts
 */
export class UnitVolt extends Unit {
    public override getFormatter(): UnitScaleFormatterConstructor {
        return VoltUnitScaleFormatter;
    }
}

const nimbleUnitVolt = UnitVolt.compose({
    baseName: 'unit-volt',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitVolt());
export const unitVoltTag = DesignSystem.tagFor(UnitVolt);
