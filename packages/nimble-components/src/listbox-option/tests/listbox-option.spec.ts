import {
    DesignSystem,
    ListboxOption as FoundationListboxOption
} from '@microsoft/fast-foundation';
import { ListboxOption } from '..';

describe('ListboxOption', () => {
    it('should have its tag returned by tagFor(FoundationListboxOption)', () => {
        expect(DesignSystem.tagFor(FoundationListboxOption)).toBe(
            'nimble-listbox-option'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-listbox-option')).toBeInstanceOf(ListboxOption);
    });
});
