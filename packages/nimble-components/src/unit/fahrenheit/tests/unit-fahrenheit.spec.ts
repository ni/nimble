import { UnitFahrenheit, unitFahrenheitTag } from '..';
import { fahrenheitUnitScale } from '../../../utilities/unit-format/unit-scale/fahrenheit-unit-scale';

describe('Fahrenheit unit', () => {
    it('should export its tag', () => {
        expect(unitFahrenheitTag).toBe('nimble-unit-fahrenheit');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-unit-fahrenheit')).toBeInstanceOf(
            UnitFahrenheit
        );
    });

    it('returns expected formatter', () => {
        const element = document.createElement('nimble-unit-fahrenheit');
        expect(element.resolvedUnitScale).toBe(fahrenheitUnitScale);
    });
});
