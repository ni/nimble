import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { ThSlider, thSliderTag } from '..';
import { ThSliderShowMinMax } from '../types';
import { ThSliderPageObject } from '../testing/th-slider.pageobject';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(
    markup = html`<${thSliderTag}></${thSliderTag}>`
): Promise<Fixture<ThSlider>> {
    return await fixture<ThSlider>(markup);
}

describe('ThSlider', () => {
    let pageObject: ThSliderPageObject;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(thSliderTag)).toBeInstanceOf(ThSlider);
    });

    it('provides the FAST Foundation slider template', async () => {
        const fixtureResult = await setup();
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        pageObject = new ThSliderPageObject(element);

        expect(pageObject.hasPart('track-container')).toBeTrue();
        expect(pageObject.hasPart('track-start')).toBeTrue();
        expect(pageObject.hasPart('thumb-container')).toBeTrue();
        expect(pageObject.getRangeLabelText('minimum-label')).toBe('0');
        expect(pageObject.getRangeLabelText('maximum-label')).toBe('10');
    });

    it('sets slider accessibility attributes', async () => {
        const fixtureResult = await setup(
            html`<${thSliderTag}
                min="2"
                max="12"
                value="6"
                orientation="vertical"
            ></${thSliderTag}>`
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
            html`<${thSliderTag}
                min="2"
                max="12"
                value="2"
                orientation="vertical"
            ></${thSliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        await waitForUpdatesAsync();

        pageObject = new ThSliderPageObject(element);
        expect(pageObject.getTrackStartPosition()).toContain('top: 100%');
        expect(pageObject.getThumbPosition()).toContain('top: 100%');

        element.value = '12';
        await waitForUpdatesAsync();

        expect(pageObject.getTrackStartPosition()).toContain('top: 0%');
        expect(pageObject.getThumbPosition()).toContain('top: 0%');
    });

    it('increases a vertical slider value when dragged upward', async () => {
        const fixtureResult = await setup(
            html`<${thSliderTag} orientation="vertical"></${thSliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        pageObject = new ThSliderPageObject(element);

        spyOn(element.track, 'getBoundingClientRect').and.returnValue(
            new DOMRect(0, 100, 4, 200)
        );
        await pageObject.mouseDown(0, 300);
        await pageObject.mouseMove(0, 100);

        expect(element.value).toBe('10');
    });

    it('uses up and down arrow keys to increase and decrease a vertical slider', async () => {
        const fixtureResult = await setup(
            html`<${thSliderTag}
                value="5"
                orientation="vertical"
            ></${thSliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        pageObject = new ThSliderPageObject(element);

        await pageObject.pressKey('ArrowUp');
        expect(element.value).toBe('6');

        await pageObject.pressKey('ArrowDown');
        expect(element.value).toBe('5');
    });

    it('sets disabled accessibility attributes and removes tabindex', async () => {
        const fixtureResult = await setup(
            html`<${thSliderTag} disabled></${thSliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();

        expect(element.getAttribute('aria-disabled')).toBe('true');
        expect(element.hasAttribute('tabindex')).toBeFalse();
    });

    it('sets readonly accessibility attributes', async () => {
        const fixtureResult = await setup(
            html`<${thSliderTag} readonly></${thSliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();

        expect(element.getAttribute('aria-readonly')).toBe('true');
        expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('can display the current value next to the thumb', async () => {
        const fixtureResult = await setup(
            html`<${thSliderTag} value="4" value-visible></${thSliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        pageObject = new ThSliderPageObject(element);

        expect(element.valueVisible).toBeTrue();
        expect(pageObject.getValueLabelText()).toBe('4');

        element.value = '7';
        await waitForUpdatesAsync();
        expect(pageObject.getValueLabelText()).toBe('7');
    });

    it('updates range labels when min and max change', async () => {
        const fixtureResult = await setup();
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        pageObject = new ThSliderPageObject(element);

        element.min = 3;
        element.max = 9;
        await waitForUpdatesAsync();

        expect(pageObject.getRangeLabelText('minimum-label')).toBe('3');
        expect(pageObject.getRangeLabelText('maximum-label')).toBe('9');
    });

    it('defaults to showing min and max labels on hover', async () => {
        const fixtureResult = await setup();
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        pageObject = new ThSliderPageObject(element);

        expect(element.showMinMax).toBe(ThSliderShowMinMax.hover);
    });

    it('can always show min and max labels', async () => {
        const fixtureResult = await setup(
            html`<${thSliderTag} show-min-max="always"></${thSliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        pageObject = new ThSliderPageObject(element);

        expect(element.showMinMax).toBe(ThSliderShowMinMax.always);
        expect(pageObject.getRangeLabelDisplay('minimum-label')).toBe('block');
        expect(pageObject.getRangeLabelDisplay('maximum-label')).toBe('block');
    });

    it('can never show min and max labels', async () => {
        const fixtureResult = await setup(
            html`<${thSliderTag} show-min-max="never"></${thSliderTag}>`
        );
        const { element, connect } = fixtureResult;
        disconnect = fixtureResult.disconnect;
        await connect();
        pageObject = new ThSliderPageObject(element);

        expect(element.showMinMax).toBe(ThSliderShowMinMax.never);
        expect(pageObject.getRangeLabelDisplay('minimum-label')).toBe('none');
        expect(pageObject.getRangeLabelDisplay('maximum-label')).toBe('none');
    });
});
