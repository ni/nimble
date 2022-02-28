import {
    DesignSystem,
    TextArea as FoundationTextArea
} from '@microsoft/fast-foundation';
import '..';

describe('Text Area', () => {
    it('should have its tag returned by tagFor(FoundationTextArea)', () => {
        expect(DesignSystem.tagFor(FoundationTextArea)).toBe('nimble-tabs');
    });
});
