import {
    DesignSystem,
    Tooltip as FoundationTooltip
} from '@microsoft/fast-foundation';
import { Tooltip } from '..';

describe('Tooltip', () => {
    it('should have its tag returned by tagFor(FoundationTooltip)', () => {
        expect(DesignSystem.tagFor(FoundationTooltip)).toBe('nimble-tooltip');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tooltip')).toBeInstanceOf(
            Tooltip
        );
    });
});
