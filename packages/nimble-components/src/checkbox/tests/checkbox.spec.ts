import {
    DesignSystem,
    Checkbox as FoundationCheckbox
} from '@microsoft/fast-foundation';
import '..';

describe('Checkbox', () => {
    it('should have its tag returned by tagFor(FoundationCheckbox)', () => {
        expect(DesignSystem.tagFor(FoundationCheckbox)).toBe(
            'nimble-checkbox'
        );
    });
});
