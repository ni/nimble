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
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(sliderTag)).toBeInstanceOf(Slider);
    });

    it('provides the FAST Foundation slider template', async () => {
        const fixtureResult = await setup();
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
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
        const fixtureResult = await setup(
            html`<${sliderTag}
                min="2"
                max="12"
                value="6"
                orientation="vertical"
            ></${sliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
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

    it('positions a vertical slider from minimum at the bottom to maximum at the top', async () => {
        const fixtureResult = await setup(
            html`<${sliderTag}
                min="2"
                max="12"
                value="2"
                orientation="vertical"
            ></${sliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        await waitForUpdatesAsync();

        const trackStart = element.shadowRoot?.querySelector<HTMLElement>(
            '[part="track-start"]'
        );
        const thumb = element.shadowRoot?.querySelector<HTMLElement>(
            '[part="thumb-container"]'
        );
        expect(trackStart?.style.top).toBe('100%');
        expect(thumb?.style.top).toBe('100%');

        element.value = '12';
        await waitForUpdatesAsync();

        expect(trackStart?.style.top).toBe('0%');
        expect(thumb?.style.top).toBe('0%');
    });

    it('increases a vertical slider value when dragged upward', async () => {
        const fixtureResult = await setup(
            html`<${sliderTag} orientation="vertical"></${sliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();

        spyOn(element.track, 'getBoundingClientRect').and.returnValue(
            new DOMRect(0, 100, 4, 200)
        );
        element.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, clientY: 300 })
        );
        window.dispatchEvent(new MouseEvent('mousemove', { clientY: 100 }));
        await waitForUpdatesAsync();

        expect(element.value).toBe('10');
    });

    it('uses up and down arrow keys to increase and decrease a vertical slider', async () => {
        const fixtureResult = await setup(
            html`<${sliderTag}
                value="5"
                orientation="vertical"
            ></${sliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();

        element.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
        );
        expect(element.value).toBe('6');

        element.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
        );
        expect(element.value).toBe('5');
    });

    it('sets disabled accessibility attributes and removes tabindex', async () => {
        const fixtureResult = await setup(
            html`<${sliderTag} disabled></${sliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();

        expect(element.getAttribute('aria-disabled')).toBe('true');
        expect(element.hasAttribute('tabindex')).toBeFalse();
    });

    it('sets readonly accessibility attributes', async () => {
        const fixtureResult = await setup(
            html`<${sliderTag} readonly></${sliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();

        expect(element.getAttribute('aria-readonly')).toBe('true');
        expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('can display the current value next to the thumb', async () => {
        const fixtureResult = await setup(
            html`<${sliderTag} value="4" value-visible></${sliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
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
        const fixtureResult = await setup();
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
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
