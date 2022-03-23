import {
    DesignSystem,
    NumberField as FoundationNumberField
} from '@microsoft/fast-foundation';
import { NumberField } from '..';

describe('NumberField', () => {
    it('should have its tag returned by tagFor(FoundationNumberField)', () => {
        expect(DesignSystem.tagFor(FoundationNumberField)).toBe(
            'nimble-number-field'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-number-field')).toBeInstanceOf(
            NumberField
        );
    });
});
