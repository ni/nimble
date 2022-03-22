import {
    DesignSystem,
    TextArea as FoundationTextArea
} from '@microsoft/fast-foundation';
import { TextArea } from '..';

describe('Text Area', () => {
    it('should have its tag returned by tagFor(FoundationTextArea)', () => {
        expect(DesignSystem.tagFor(FoundationTextArea)).toBe(
            'nimble-text-area'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-text-area')).toBeInstanceOf(
            TextArea
        );
    });
});
