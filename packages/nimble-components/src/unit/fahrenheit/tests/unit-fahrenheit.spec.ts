import { UnitFahrenheit, unitFahrenheitTag } from '..';
import { fahrenheitUnitScale } from '../../../utilities/unit-format/unit-scale/fahrenheit-unit-scale';

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
