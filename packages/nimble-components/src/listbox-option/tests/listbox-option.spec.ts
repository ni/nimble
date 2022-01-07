import {
    DesignSystem,
    ListboxOption as FoundationListboxOption
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '../index';

describe('ListboxOption', () => {
    it('should have its tag returned by tagFor(FoundationListboxOption)', () => {
        expect(html`${DesignSystem.tagFor(FoundationListboxOption)}`.html).toBe(
            'nimble-listbox-option'
        );
    });
});
