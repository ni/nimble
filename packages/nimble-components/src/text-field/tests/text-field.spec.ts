import {
    DesignSystem,
    TextField as FoundationTextField
} from '@microsoft/fast-foundation';
import { TextField } from '..';

describe('TextField', () => {
    it('should export its tag', () => {
        expect(DesignSystem.tagFor(FoundationTextField)).toBe(
            'nimble-text-field'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-text-field')).toBeInstanceOf(
            TextField
        );
    });
});
