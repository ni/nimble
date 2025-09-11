import { fixture, html, expect } from '@open-wc/testing';
import { Tooltip, tooltipTag } from '../index';

describe('Tooltip ::part(control)', () => {
    it('should allow max-width, max-height, and overflow to be set via part API', async () => {
        const el = await fixture<Tooltip>(html`
            <nimble-tooltip style="position: absolute; left: 0; top: 0;" visible>
                <span>Some long tooltip content that should wrap and overflow if constrained.</span>
            </nimble-tooltip>
        `);
        const tooltip = el.shadowRoot!.querySelector('[part="control"]') as HTMLElement;
        // Simulate client styling
        tooltip.style.maxWidth = '100px';
        tooltip.style.maxHeight = '30px';
        tooltip.style.overflow = 'auto';
        expect(getComputedStyle(tooltip).maxWidth).toBe('100px');
        expect(getComputedStyle(tooltip).maxHeight).toBe('30px');
        expect(getComputedStyle(tooltip).overflow).toBe('auto');
    });
});
