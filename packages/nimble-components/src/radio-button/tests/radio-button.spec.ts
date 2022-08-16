import {
    DesignSystem,
    Radio as FoundationRadio
} from '@microsoft/fast-foundation';
import { RadioButton } from '..';

describe('Radio Button', () => {
    it('should have its tag returned by tagFor(FoundationRadio)', () => {
        expect(DesignSystem.tagFor(FoundationRadio)).toBe(
            'nimble-radio-button'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-radio-button')).toBeInstanceOf(
            RadioButton
        );
    });
});
