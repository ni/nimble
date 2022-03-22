import {
    DesignSystem,
    Checkbox as FoundationCheckbox
} from '@microsoft/fast-foundation';
import { Checkbox } from '..';

describe('Checkbox', () => {
    it('should have its tag returned by tagFor(FoundationCheckbox)', () => {
        expect(DesignSystem.tagFor(FoundationCheckbox)).toBe('nimble-checkbox');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-checkbox')).toBeInstanceOf(Checkbox);
    });
});
