import { DOM, html } from '@microsoft/fast-element';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import '..';
import type { ToggleButton } from '..';

async function setup(): Promise<Fixture<ToggleButton>> {
    return fixture<ToggleButton>(
        html` <nimble-toggle-button> </nimble-toggle-button>`
    );
}

describe('ToggleButton', () => {
    it('should set a role of `button` on the internal control', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.control.getAttribute('role')).toBe('button');

        await disconnect();
    });

    it('should set the `aria-pressed` attribute on the internal control equal to the `checked` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.checked = true;

        await connect();

        expect(element.control.getAttribute('aria-pressed')).toBe('true');

        element.checked = false;

        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-pressed')).toBe('false');

        await disconnect();
    });

    it('should add a class of `checked` on the internal control when checked is true', async () => {
        const { element, connect, disconnect } = await setup();

        element.checked = true;

        await connect();

        expect(element.control.classList.contains('checked')).toBe(true);

        await disconnect();
    });

    it('should set a default `aria-pressed` value on the internal control when `checked` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.control.getAttribute('aria-pressed')).toBe('false');

        await disconnect();
    });

    it('should set the `aria-disabled` attribute on the internal control equal to the `disabled` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.control.getAttribute('aria-disabled')).toBe('true');

        element.disabled = false;

        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-disabled')).toBe('false');

        await disconnect();
    });

    it('should set a default `aria-disabled` value on the internal control when `disabled` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.control.getAttribute('aria-disabled')).toBe('false');

        await disconnect();
    });

    it('should set the `aria-readonly` attribute on the internal control equal to the `readonly` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.readOnly = true;

        await connect();

        expect(element.control.getAttribute('aria-readonly')).toBe('true');

        element.readOnly = false;

        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-readonly')).toBe('false');

        await disconnect();
    });

    it('should NOT set a default `aria-readonly` value on the internal control when `readonly` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('aria-readonly')).toBe(null);

        await disconnect();
    });

    it('should set a tabindex of 0 on the internal control', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.control.getAttribute('tabindex')).toBe('0');

        await disconnect();
    });

    it('should NOT set a tabindex on the internal control when disabled is `true`', async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.control.hasAttribute('tabindex')).toBe(false);
        expect(element.control.getAttribute('tabindex')).toBe(null);

        await disconnect();
    });

    describe('events', () => {
        it('should fire an event on click', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(element.checked).toBe(false);

            element.control.click();

            expect(element.checked).toBe(true);

            await disconnect();
        });

        it('should fire an event when spacebar is invoked', async () => {
            const { element, connect, disconnect } = await setup();
            const event = new KeyboardEvent('keypress', {
                key: keySpace
            } as KeyboardEventInit);

            await connect();

            expect(element.checked).toBe(false);

            element.control.dispatchEvent(event);

            expect(element.checked).toBe(true);

            await disconnect();
        });

        xit('should fire an event when enter is invoked', async () => {
            const { element, connect, disconnect } = await setup();
            const event = new KeyboardEvent('keypress', {
                key: keyEnter
            } as KeyboardEventInit);

            await connect();

            expect(element.checked).toBe(false);

            element.control.dispatchEvent(event);

            expect(element.checked).toBe(true);

            await disconnect();
        });
    });
});
