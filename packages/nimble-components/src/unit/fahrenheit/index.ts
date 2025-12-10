import { DesignSystem } from '@ni/fast-foundation';
import { fahrenheitUnitScale } from '@ni/unit-format/unit-scale/fahrenheit';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-fahrenheit': UnitFahrenheit;
    }
}

/**
 * Element representing degrees Fahrenheit unit
 */
export class UnitFahrenheit extends Unit {
    public constructor() {
        super();
        this.resolvedUnitScale = fahrenheitUnitScale;
    }
}

const nimbleUnitFahrenheit = UnitFahrenheit.compose({
    baseName: 'unit-fahrenheit',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleUnitFahrenheit());
export const unitFahrenheitTag = 'nimble-unit-fahrenheit';
