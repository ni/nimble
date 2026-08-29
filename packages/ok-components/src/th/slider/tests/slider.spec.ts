import { html } from '@ni/fast-element';
import { Slider, sliderTag } from '..';
import { fixture } from '../../../utilities/tests/fixture';

describe('Slider', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(sliderTag)).toBeInstanceOf(Slider);
    });

    it('provides the FAST Foundation slider template', async () => {
        const { element, connect, disconnect } = await fixture<Slider>(
            html`<${sliderTag}></${sliderTag}>`
        );
        await connect();

        expect(element.shadowRoot?.querySelector('[part="track-container"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('[part="track-start"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('[part="thumb-container"]')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('.minimum-label')?.textContent?.trim()).toBe('0');
        expect(element.shadowRoot?.querySelector('.maximum-label')?.textContent?.trim()).toBe('10');

        await disconnect();
    });

    it('can display the current value next to the thumb', async () => {
        const { element, connect, disconnect } = await fixture<Slider>(
            html`<${sliderTag} value="4" value-visible></${sliderTag}>`
        );
        await connect();

        expect(element.valueVisible).toBeTrue();
        expect(
            element.shadowRoot?.querySelector('.value-label')?.textContent?.trim()
        ).toBe('4');

        element.value = '7';
        await Promise.resolve();
        expect(
            element.shadowRoot?.querySelector('.value-label')?.textContent?.trim()
        ).toBe('7');

        await disconnect();
    });
});
