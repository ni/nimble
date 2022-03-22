import {
    DesignSystem,
    Button as FoundationButton
} from '@microsoft/fast-foundation';
import { Button } from '..';

describe('Button', () => {
    it('should have its tag returned by tagFor(FoundationButton)', () => {
        expect(DesignSystem.tagFor(FoundationButton)).toBe('nimble-button');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-button')).toBeInstanceOf(Button);
    });
});
