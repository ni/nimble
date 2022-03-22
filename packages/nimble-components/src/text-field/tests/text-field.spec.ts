import {
    DesignSystem,
    TextField as FoundationTextField
} from '@microsoft/fast-foundation';
import { TextField } from '..';

describe('TextField', () => {
    it('should have its tag returned by tagFor(FoundationTextField)', () => {
        expect(DesignSystem.tagFor(FoundationTextField)).toBe(
            'nimble-text-field'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-text-field')).toBeInstanceOf(TextField);
    });
});
