import {
    DesignSystem
} from '@microsoft/fast-foundation';
import { InternalErrorText } from '..';

describe('InternalErrorText', () => {
    it('should have its tag returned by tagFor(InternalErrorText)', () => {
        expect(DesignSystem.tagFor(InternalErrorText)).toBe(
            'nimble-internal-error-text'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-internal-error-text')).toBeInstanceOf(
            InternalErrorText
        );
    });
});
