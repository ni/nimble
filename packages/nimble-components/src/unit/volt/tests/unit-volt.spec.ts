import { unitScaleVolt } from '@ni/unit-format/unit-scale/volt';
import { UnitVolt, unitVoltTag } from '..';

describe('Volt unit', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(unitVoltTag)).toBeInstanceOf(UnitVolt);
    });

    it('returns expected formatter', () => {
        const element = document.createElement(unitVoltTag);
        expect(element.resolvedUnitScale).toBe(unitScaleVolt);
    });
});
