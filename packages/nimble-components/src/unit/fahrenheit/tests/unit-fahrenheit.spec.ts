import { fahrenheitUnitScale } from '@ni/unit-format/unit-scale/fahrenheit';
import { UnitFahrenheit, unitFahrenheitTag } from '..';

describe('Fahrenheit unit', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(unitFahrenheitTag)).toBeInstanceOf(
            UnitFahrenheit
        );
    });

    it('returns expected formatter', () => {
        const element = document.createElement(unitFahrenheitTag);
        expect(element.resolvedUnitScale).toBe(fahrenheitUnitScale);
    });
});
