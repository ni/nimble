import {
    DesignSystem,
    NumberField as FoundationNumberField
} from '@microsoft/fast-foundation';
import '..';

describe('NumberField', () => {
    it('should have its tag returned by tagFor(FoundationNumberField)', () => {
        expect(DesignSystem.tagFor(FoundationNumberField)).toBe(
            'nimble-number-field'
        );
    });
});
