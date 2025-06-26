import { UnitVolt, unitVoltTag } from '..';
import { voltUnitScale } from '../../../utilities/unit-format/unit-scale/volt-unit-scale';

describe('Volt unit', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(unitVoltTag)).toBeInstanceOf(UnitVolt);
    });

    it('returns expected formatter', () => {
        const element = document.createElement(unitVoltTag);
        expect(element.resolvedUnitScale).toBe(voltUnitScale);
    });
});
