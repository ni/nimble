import { customElement } from '@ni/fast-element';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { fahrenheitUnitScale } from '../../utilities/unit-format/unit-scale/fahrenheit-unit-scale';
import { styles } from '../base/styles';

export const unitFahrenheitTag = 'nimble-unit-fahrenheit';

declare global {
    interface HTMLElementTagNameMap {
        [unitFahrenheitTag]: UnitFahrenheit;
    }
}

/**
 * Element representing degrees Fahrenheit unit
 */
@customElement({
    name: unitFahrenheitTag,
    template,
    styles
})
export class UnitFahrenheit extends Unit {
    public constructor() {
        super();
        this.resolvedUnitScale = fahrenheitUnitScale;
    }
}
