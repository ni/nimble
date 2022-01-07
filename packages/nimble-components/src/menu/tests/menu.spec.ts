import {
    DesignSystem,
    Menu as FoundationMenu
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '../index';

describe('Menu', () => {
    it('should have its tag returned by tagFor(FoundationMenu)', () => {
        expect(html`${DesignSystem.tagFor(FoundationMenu)}`.html).toBe(
            'nimble-menu'
        );
    });
});
