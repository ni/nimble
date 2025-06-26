import { DesignSystem } from '@ni/fast-foundation';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { celsiusUnitScale } from '../../utilities/unit-format/unit-scale/celsius-unit-scale';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-celsius': UnitCelsius;
    }
}

/**
 * Element representing degrees Celsius unit
 */
export class UnitCelsius extends Unit {
    public constructor() {
        super();
        this.resolvedUnitScale = celsiusUnitScale;
    }
}

const nimbleUnitCelsius = UnitCelsius.compose({
    baseName: 'unit-celsius',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitCelsius());
export const unitCelsiusTag = 'nimble-unit-celsius';
