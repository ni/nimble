import { unitScaleCelsius } from '@ni/unit-format/unit-scale/celsius';
import { UnitCelsius, unitCelsiusTag } from '..';

describe('Celsius unit', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(unitCelsiusTag)).toBeInstanceOf(
            UnitCelsius
        );
    });

    it('returns expected formatter', () => {
        const element = document.createElement(unitCelsiusTag);
        expect(element.resolvedUnitScale).toBe(unitScaleCelsius);
    });
});
