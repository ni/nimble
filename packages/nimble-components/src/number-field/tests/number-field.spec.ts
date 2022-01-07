import {
    DesignSystem,
    NumberField as FoundationNumberField
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '..';

describe('NumberField', () => {
    it('should have its tag returned by tagFor(FoundationNumberField)', () => {
        expect(html`${DesignSystem.tagFor(FoundationNumberField)}`.html).toBe(
            'nimble-number-field'
        );
    });
});
