import { UnitVolt, unitVoltTag } from '..';
import { voltUnitScale } from '../../../utilities/number-formatter/manually-translated-unit-scale/volt-unit-scale';

describe('Volt unit', () => {
    it('should export its tag', () => {
        expect(unitVoltTag).toBe('nimble-unit-volt');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-unit-volt')).toBeInstanceOf(
            UnitVolt
        );
    });

    it('returns expected formatter', () => {
        const element = document.createElement('nimble-unit-volt');
        expect(element.getUnitScale()).toBe(voltUnitScale);
    });
});
