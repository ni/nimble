import {
    DesignSystem,
    TextField as FoundationTextField
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '../index';

describe('TextField', () => {
    it('should have its tag returned by tagFor(FoundationTextField)', () => {
        expect(html`${DesignSystem.tagFor(FoundationTextField)}`.html).toBe(
            'nimble-text-field'
        );
    });
});
