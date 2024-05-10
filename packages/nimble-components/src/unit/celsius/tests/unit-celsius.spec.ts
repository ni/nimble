import { UnitCelsius, unitCelsiusTag } from '..';
import { celsiusUnitScale } from '../../../utilities/unit-format/unit-scale/celsius-unit-scale';

describe('Celsius unit', () => {
    it('should export its tag', () => {
        expect(unitCelsiusTag).toBe('nimble-unit-celsius');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-unit-celsius')).toBeInstanceOf(
            UnitCelsius
        );
    });

    it('returns expected formatter', () => {
        const element = document.createElement('nimble-unit-celsius');
        expect(element.resolvedUnitScale).toBe(celsiusUnitScale);
    });
});
