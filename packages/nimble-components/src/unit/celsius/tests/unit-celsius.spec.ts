import { UnitCelsius, unitCelsiusTag } from '..';
import { celsiusUnitScale } from '../../../utilities/unit-format/unit-scale/celsius-unit-scale';

describe('Celsius unit', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(unitCelsiusTag)).toBeInstanceOf(
            UnitCelsius
        );
    });

    it('returns expected formatter', () => {
        const element = document.createElement(unitCelsiusTag);
        expect(element.resolvedUnitScale).toBe(celsiusUnitScale);
    });
});
