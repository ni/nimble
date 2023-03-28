import { html } from '@microsoft/fast-element';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Switch, switchTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

async function setup(): Promise<Fixture<Switch>> {
    return fixture<Switch>(html`<nimble-switch></nimble-switch>`);
}

describe('Switch', () => {
    let element: Switch;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let parent: HTMLElement;

    beforeEach(async () => {
        ({ element, connect, disconnect, parent } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(switchTag).toBe('nimble-switch');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-switch')).toBeInstanceOf(Switch);
    });

    it('should have a role of `switch`', async () => {
        await connect();

        expect(element.getAttribute('role')).toBe('switch');

        await disconnect();
    });

    it('should set the `aria-checked` attribute equal to the `checked` value', async () => {
        element.checked = true;
        await connect();

        expect(element.getAttribute('aria-checked')).toBe('true');
        element.checked = false;
        await waitForUpdatesAsync();
        expect(element.getAttribute('aria-checked')).toBe('false');

        await disconnect();
    });

    it('should add a class of `checked` when checked is true', async () => {
        element.checked = true;
        await connect();

        expect(element.classList.contains('checked')).toBe(true);

        await disconnect();
    });

    it('should set a default `aria-checked` value when `checked` is not defined', async () => {
        await connect();

        expect(element.getAttribute('aria-checked')).toBe('false');

        await disconnect();
    });

    it('should set the `aria-disabled` attribute equal to the `disabled` value', async () => {
        element.disabled = true;
        await connect();

        expect(element.getAttribute('aria-disabled')).toBe('true');
        element.disabled = false;
        await waitForUpdatesAsync();
        expect(element.getAttribute('aria-disabled')).toBe('false');

        await disconnect();
    });

    it('should set a default `aria-disabled` value when `disabled` is not defined', async () => {
        await connect();

        expect(element.getAttribute('aria-disabled')).toBe('false');

        await disconnect();
    });

    it('should set the `aria-readonly` attribute equal to the `readonly` value', async () => {
        element.readOnly = true;
        await connect();

        expect(element.getAttribute('aria-readonly')).toBe('true');
        element.readOnly = false;
        await waitForUpdatesAsync();
        expect(element.getAttribute('aria-readonly')).toBe('false');

        await disconnect();
    });

    it('should NOT set a default `aria-readonly` value when `readonly` is not defined', async () => {
        await connect();

        expect(element.getAttribute('aria-readonly')).toBe(null);

        await disconnect();
    });

    it('should set a tabindex of 0 on the element', async () => {
        await connect();

        expect(element.getAttribute('tabindex')).toBe('0');

        await disconnect();
    });

    it('should NOT set a tabindex when disabled is `true`', async () => {
        element.disabled = true;
        await connect();

        expect(element.hasAttribute('tabindex')).toBe(false);
        expect(element.getAttribute('tabindex')).toBe(null);

        await disconnect();
    });

    it('should initialize to the initial value if no value property is set', async () => {
        await connect();

        expect(element.value).toBe(element.initialValue);

        await disconnect();
    });

    it('should initialize to the provided value attribute if set pre-connection', async () => {
        element.setAttribute('value', 'foobar');
        await connect();

        expect(element.value).toBe('foobar');

        await disconnect();
    });

    it('should initialize to the provided value attribute if set post-connection', async () => {
        await connect();
        element.setAttribute('value', 'foobar');

        expect(element.value).toBe('foobar');

        await disconnect();
    });

    it('should initialize to the provided value property if set pre-connection', async () => {
        element.value = 'foobar';
        await connect();

        expect(element.value).toBe('foobar');

        await disconnect();
    });

    describe('label', () => {
        it('should add a class of `label` to the internal label when default slotted content exists', async () => {
            const label = document.createElement('span');
            element.appendChild(label);
            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('label')
                    ?.classList.contains('label')
            ).toBe(true);

            await disconnect();
        });

        it('should add classes of `label` and `label__hidden` to the internal label when default slotted content exists', async () => {
            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('label')
                    ?.classList.contains('label')
            ).toBe(true);
            expect(
                element.shadowRoot
                    ?.querySelector('label')
                    ?.classList.contains('label__hidden')
            ).toBe(true);

            await disconnect();
        });
    });

    describe('events', () => {
        it('should fire an event on click', async () => {
            let wasClicked = false;
            await connect();

            element.addEventListener('click', e => {
                e.preventDefault();

                wasClicked = true;
            });
            await waitForUpdatesAsync();
            element.click();
            expect(wasClicked).toBe(true);

            await disconnect();
        });

        it('should fire an event when spacebar is invoked', async () => {
            let wasInvoked = false;
            const event = new KeyboardEvent('keydown', {
                key: keySpace
            } as KeyboardEventInit);
            await connect();

            element.addEventListener('keydown', e => {
                e.preventDefault();

                wasInvoked = true;
            });
            await waitForUpdatesAsync();
            element.dispatchEvent(event);
            expect(wasInvoked).toBe(true);

            await disconnect();
        });

        it('should fire an event when enter is invoked', async () => {
            let wasInvoked = false;
            const event = new KeyboardEvent('keydown', {
                key: keyEnter
            } as KeyboardEventInit);
            await connect();

            element.addEventListener('keydown', e => {
                e.preventDefault();

                wasInvoked = true;
            });
            await waitForUpdatesAsync();
            element.dispatchEvent(event);
            expect(wasInvoked).toBe(true);

            await disconnect();
        });
    });

    describe('that is required', () => {
        it('should be invalid when unchecked', async () => {
            await connect();

            element.required = true;
            element.checked = false;
            expect(element.validity.valueMissing).toBe(true);

            await disconnect();
        });

        it('should be valid when checked', async () => {
            await connect();

            element.required = true;
            element.checked = true;
            expect(element.validity.valueMissing).toBe(false);

            await disconnect();
        });
    });

    describe('whose parent form has its reset() method invoked', () => {
        it('should set its checked property to false if the checked attribute is unset', async () => {
            await connect();
            const form = document.createElement('form');
            parent.appendChild(form);
            form.appendChild(element);
            element.checked = true;

            expect(element.getAttribute('checked')).toBeNull();
            expect(element.checked).toBeTrue();
            form.reset();
            expect(!!element.checked).toBeFalse();

            await disconnect();
        });

        it('should set its checked property to true if the checked attribute is set', async () => {
            await connect();
            const form = document.createElement('form');
            parent.appendChild(form);
            form.appendChild(element);
            element.setAttribute('checked', '');

            expect(element.getAttribute('checked')).toBe('');
            expect(element.checked).toBeTrue();
            element.checked = false;
            expect(element.checked).toBeFalse();
            form.reset();
            expect(element.checked).toBeTrue();

            await disconnect();
        });

        it('should put the control into a clean state, where checked attribute changes change the checked property prior to user or programmatic interaction', async () => {
            await connect();
            const form = document.createElement('form');
            parent.appendChild(form);
            form.appendChild(element);
            element.checked = true;
            element.removeAttribute('checked');

            expect(element.checked).toBeTrue();
            form.reset();
            expect(!!element.checked).toBeFalse();
            element.setAttribute('checked', '');
            expect(element.checked).toBeTrue();

            await disconnect();
        });
    });
});
