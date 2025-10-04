import { customElement } from '@ni/fast-element';
import { template } from '../base/template';
import { Unit } from '../base/unit';
import { voltUnitScale } from '../../utilities/unit-format/unit-scale/volt-unit-scale';
import { styles } from '../base/styles';

export const unitVoltTag = 'nimble-unit-volt';

declare global {
    interface HTMLElementTagNameMap {
        [unitVoltTag]: UnitVolt;
    }
}

/**
 * Element representing units for volts
 */
@customElement({
    name: unitVoltTag,
    template,
    styles
})
export class UnitVolt extends Unit {
    public constructor() {
        super();
        this.resolvedUnitScale = voltUnitScale;
    }
}
