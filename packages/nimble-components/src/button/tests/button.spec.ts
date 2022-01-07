import {
    DesignSystem,
    Button as FoundationButton
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '..';

describe('Button', () => {
    it('should have its tag returned by tagFor(FoundationButton)', () => {
        expect(html`${DesignSystem.tagFor(FoundationButton)}`.html).toBe(
            'nimble-button'
        );
    });
});
