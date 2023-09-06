import { html } from '@microsoft/fast-element';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { ToggleButton } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

async function setup(): Promise<Fixture<ToggleButton>> {
    return fixture<ToggleButton>(
        html`<nimble-toggle-button></nimble-toggle-button>`
    );
}

describe('ToggleButton', () => {
    let element: ToggleButton;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-toggle-button')).toBeInstanceOf(
            ToggleButton
        );
    });

    it('should set a role of `button` on the internal control', async () => {
        await connect();
        expect(element.control.getAttribute('role')).toBe('button');
    });

    it('should set the `aria-pressed` attribute on the internal control equal to the `checked` value', async () => {
        element.checked = true;
        await connect();
        expect(element.control.getAttribute('aria-pressed')).toBe('true');

        element.checked = false;
        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-pressed')).toBe('false');
    });

    it('should add a class of `checked` on the internal control when checked is true', async () => {
        element.checked = true;
        await connect();
        expect(element.control.classList.contains('checked')).toBe(true);
    });

    it('should set a default `aria-pressed` value on the internal control when `checked` is not defined', async () => {
        await connect();
        expect(element.control.getAttribute('aria-pressed')).toBe('false');
    });

    it('should set the `aria-disabled` attribute on the internal control equal to the `disabled` value', async () => {
        element.disabled = true;
        await connect();
        expect(element.control.getAttribute('aria-disabled')).toBe('true');

        element.disabled = false;
        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-disabled')).toBe('false');
    });

    it('should set a default `aria-disabled` value on the internal control when `disabled` is not defined', async () => {
        await connect();
        expect(element.control.getAttribute('aria-disabled')).toBe('false');
    });

    it('should set the `aria-readonly` attribute on the internal control equal to the `readonly` value', async () => {
        element.readOnly = true;
        await connect();
        expect(element.control.getAttribute('aria-readonly')).toBe('true');

        element.readOnly = false;
        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-readonly')).toBe('false');
    });

    it('should NOT set a default `aria-readonly` value on the internal control when `readonly` is not defined', async () => {
        await connect();
        expect(element.control.getAttribute('aria-readonly')).toBe(null);
    });

    it('should reflect `aria-haspopup` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-haspopup', 'menu');
        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-haspopup')).toBe('menu');
    });

    it('should set a tabindex of 0 on the internal control', async () => {
        await connect();
        expect(element.control.getAttribute('tabindex')).toBe('0');
    });

    it('should NOT set a tabindex on the internal control when disabled is `true`', async () => {
        element.disabled = true;
        await connect();
        expect(element.control.hasAttribute('tabindex')).toBe(false);
        expect(element.control.getAttribute('tabindex')).toBe(null);
    });

    describe('events', () => {
        it('should fire an event on click', async () => {
            await connect();
            expect(element.checked).toBe(false);
            element.control.click();
            expect(element.checked).toBe(true);
        });

        it('should fire an event when spacebar is invoked', async () => {
            await connect();
            expect(element.checked).toBe(false);

            const event = new KeyboardEvent('keypress', {
                key: keySpace
            } as KeyboardEventInit);
            element.control.dispatchEvent(event);

            expect(element.checked).toBe(true);
        });

        it('should fire an event when enter is invoked', async () => {
            await connect();
            expect(element.checked).toBe(false);

            const event = new KeyboardEvent('keypress', {
                key: keyEnter
            } as KeyboardEventInit);
            element.control.dispatchEvent(event);

            expect(element.checked).toBe(true);
        });
    });
});
