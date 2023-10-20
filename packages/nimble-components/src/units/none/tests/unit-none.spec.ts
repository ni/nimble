import { UnitNone, unitNoneTag } from '..';

describe('None unit', () => {
    it('should export its tag', () => {
        expect(unitNoneTag).toBe('nimble-unit-none');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-unit-none')).toBeInstanceOf(
            UnitNone
        );
    });

    // logic tested indirectly by number-text column's default and decimal formatter tests
});
