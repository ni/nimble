import { customElement } from '@ni/fast-element';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { celsiusUnitScale } from '../../utilities/unit-format/unit-scale/celsius-unit-scale';
import { styles } from '../base/styles';

export const unitCelsiusTag = 'nimble-unit-celsius';

declare global {
    interface HTMLElementTagNameMap {
        [unitCelsiusTag]: UnitCelsius;
    }
}

/**
 * Element representing degrees Celsius unit
 */
@customElement({
    name: unitCelsiusTag,
    template,
    styles
})
export class UnitCelsius extends Unit {
    public constructor() {
        super();
        this.resolvedUnitScale = celsiusUnitScale;
    }
}
