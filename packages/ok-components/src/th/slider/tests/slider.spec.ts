import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { Slider, sliderTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(
    markup = html`<${sliderTag}></${sliderTag}>`
): Promise<Fixture<Slider>> {
    return await fixture<Slider>(markup);
}

describe('Slider', () => {
    let element: Slider;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(sliderTag)).toBeInstanceOf(Slider);
    });

    it('provides the FAST Foundation slider template', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(
            element.shadowRoot?.querySelector('[part="track-container"]')
        ).not.toBeNull();
        expect(
            element.shadowRoot?.querySelector('[part="track-start"]')
        ).not.toBeNull();
        expect(
            element.shadowRoot?.querySelector('[part="thumb-container"]')
        ).not.toBeNull();
        expect(
            element.shadowRoot?.querySelector('.minimum-label')?.textContent?.trim()
        ).toBe('0');
        expect(
            element.shadowRoot?.querySelector('.maximum-label')?.textContent?.trim()
        ).toBe('10');
    });

    it('sets slider accessibility attributes', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${sliderTag}
                min="2"
                max="12"
                value="6"
                orientation="vertical"
            ></${sliderTag}>`
        ));
        element.valueTextFormatter = value => `${value} units`;
        await connect();
        await waitForUpdatesAsync();

        expect(element.getAttribute('role')).toBe('slider');
        expect(element.getAttribute('aria-valuemin')).toBe('2');
        expect(element.getAttribute('aria-valuemax')).toBe('12');
        expect(element.getAttribute('aria-valuenow')).toBe('6');
        expect(element.getAttribute('aria-valuetext')).toBe('6 units');
        expect(element.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('sets disabled accessibility attributes and removes tabindex', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${sliderTag} disabled></${sliderTag}>`
        ));
        await connect();

        expect(element.getAttribute('aria-disabled')).toBe('true');
        expect(element.hasAttribute('tabindex')).toBeFalse();
    });

    it('sets readonly accessibility attributes', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${sliderTag} readonly></${sliderTag}>`
        ));
        await connect();

        expect(element.getAttribute('aria-readonly')).toBe('true');
        expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('can display the current value next to the thumb', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${sliderTag} value="4" value-visible></${sliderTag}>`
        ));
        await connect();

        expect(element.valueVisible).toBeTrue();
        expect(
            element.shadowRoot?.querySelector('.value-label')?.textContent?.trim()
        ).toBe('4');

        element.value = '7';
        await waitForUpdatesAsync();
        expect(
            element.shadowRoot?.querySelector('.value-label')?.textContent?.trim()
        ).toBe('7');
    });

    it('updates range labels when min and max change', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        element.min = 3;
        element.max = 9;
        await waitForUpdatesAsync();

        expect(
            element.shadowRoot?.querySelector('.minimum-label')?.textContent?.trim()
        ).toBe('3');
        expect(
            element.shadowRoot?.querySelector('.maximum-label')?.textContent?.trim()
        ).toBe('9');
    });
});
