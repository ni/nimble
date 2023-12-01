import { UnitVolt, unitVoltTag } from '..';
import { VoltUnitScale } from '../../../utilities/number-formatter/unit/volt-unit-scale';

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
        expect(element.getUnitScale()).toBe(VoltUnitScale.instance);
    });
});
