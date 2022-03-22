import {
    DesignSystem,
    MenuItem as FoundationMenuItem
} from '@microsoft/fast-foundation';
import { MenuItem } from '..';

describe('MenuItem', () => {
    it('should have its tag returned by tagFor(FoundationMenuItem)', () => {
        expect(DesignSystem.tagFor(FoundationMenuItem)).toBe(
            'nimble-menu-item'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-menu-item')).toBeInstanceOf(
            MenuItem
        );
    });
});
