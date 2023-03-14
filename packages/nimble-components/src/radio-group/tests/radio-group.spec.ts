import {
    DesignSystem,
    RadioGroup as FoundationRadioGroup
} from '@microsoft/fast-foundation';
import { RadioGroup } from '..';

describe('Radio Group', () => {
    it('should export its tag', () => {
        expect(DesignSystem.tagFor(FoundationRadioGroup)).toBe(
            'nimble-radio-group'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-radio-group')).toBeInstanceOf(
            RadioGroup
        );
    });
});
