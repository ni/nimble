import {
    DesignSystem,
    Menu as FoundationMenu
} from '@microsoft/fast-foundation';
import { Menu } from '..';

describe('Menu', () => {
    it('should export its tag', () => {
        expect(DesignSystem.tagFor(FoundationMenu)).toBe('nimble-menu');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-menu')).toBeInstanceOf(Menu);
    });
});
