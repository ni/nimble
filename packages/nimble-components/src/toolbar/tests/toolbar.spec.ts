import {
    DesignSystem,
    Toolbar as FoundationToolbar
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '..';

describe('Toolbar', () => {
    it('should have its tag returned by tagFor(FoundationToolbar)', () => {
        expect(html`${DesignSystem.tagFor(FoundationToolbar)}`.html).toBe(
            'nimble-toolbar'
        );
    });
});
