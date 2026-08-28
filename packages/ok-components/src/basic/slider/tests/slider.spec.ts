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

        await disconnect();
    });
});
