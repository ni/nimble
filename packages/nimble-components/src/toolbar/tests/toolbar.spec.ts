import {
    DesignSystem,
    Toolbar as FoundationToolbar
} from '@microsoft/fast-foundation';
import { Toolbar } from '..';

describe('Toolbar', () => {
    it('should have its tag returned by tagFor(FoundationToolbar)', () => {
        expect(DesignSystem.tagFor(FoundationToolbar)).toBe(
            'nimble-toolbar'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-toolbar')).toBeInstanceOf(
            Toolbar
        );
    });
});
