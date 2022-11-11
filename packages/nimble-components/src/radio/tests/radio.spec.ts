import {
    DesignSystem,
    Radio as FoundationRadio
} from '@microsoft/fast-foundation';
import { Radio } from '..';

describe('Radio', () => {
    it('should have its tag returned by tagFor(FoundationRadio)', () => {
        expect(DesignSystem.tagFor(FoundationRadio)).toBe('nimble-radio');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-radio')).toBeInstanceOf(Radio);
    });
});
