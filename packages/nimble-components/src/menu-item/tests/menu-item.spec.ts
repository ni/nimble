import {
    DesignSystem,
    MenuItem as FoundationMenuItem
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';
import '../index';

describe('MenuItem', () => {
    it('should have its tag returned by tagFor(FoundationMenuItem)', () => {
        expect(html`${DesignSystem.tagFor(FoundationMenuItem)}`.html).toBe(
            'nimble-menu-item'
        );
    });
});
