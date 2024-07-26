import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { fahrenheitUnitScale } from '../../utilities/unit-format/unit-scale/fahrenheit-unit-scale';
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
