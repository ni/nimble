import {
    DesignSystem,
    ListboxOption as FoundationListboxOption
} from '@microsoft/fast-foundation';
import { ListOption } from '..';

describe('ListboxOption', () => {
    it('should have its tag returned by tagFor(FoundationListboxOption)', () => {
        expect(DesignSystem.tagFor(FoundationListboxOption)).toBe(
            'nimble-list-option'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-list-option')).toBeInstanceOf(
            ListOption
        );
    });
});
