import {
    DesignSystem,
    Checkbox as FoundationCheckbox
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '..';

describe('Checkbox', () => {
    it('should have its tag returned by tagFor(FoundationCheckbox)', () => {
        expect(html`${DesignSystem.tagFor(FoundationCheckbox)}`.html).toBe(
            'nimble-checkbox'
        );
    });
});
