import {
    DesignSystem,
    TextField as FoundationTextField
} from '@microsoft/fast-foundation';
import '..';

describe('TextField', () => {
    it('should have its tag returned by tagFor(FoundationTextField)', () => {
        expect(DesignSystem.tagFor(FoundationTextField)).toBe(
            'nimble-text-field'
        );
    });
});
