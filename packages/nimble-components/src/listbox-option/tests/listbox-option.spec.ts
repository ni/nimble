import {
    DesignSystem,
    ListboxOption as FoundationListboxOption
} from '@microsoft/fast-foundation';
import '..';

describe('ListboxOption', () => {
    it('should have its tag returned by tagFor(FoundationListboxOption)', () => {
        expect(DesignSystem.tagFor(FoundationListboxOption)).toBe(
            'nimble-listbox-option'
        );
    });
});
