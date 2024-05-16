/**
 * Based on tests in FAST repo: https://github.com/microsoft/fast/blob/9c6dbb66615e6d229fc0ebf8065a67f109139f26/packages/web-components/fast-foundation/src/checkbox/checkbox.spec.ts
 */
import { DOM } from '@microsoft/fast-element';
import { keySpace } from '@microsoft/fast-web-utilities';
import { Checkbox } from '..';
import { template } from '../template';
import { fixture } from '../../utilities/tests/fixture';

const checkbox = Checkbox.compose({
    baseName: 'checkbox',
    template
});

async function setup(): Promise<{
    element: Checkbox,
    connect: () => Promise<void>,
    disconnect: () => Promise<void>,
    parent: HTMLElement
}> {
    const { connect, disconnect, element, parent } = await fixture(checkbox());

    return { connect, disconnect, element, parent };
}

describe('Checkbox', () => {
    it('should have a role of `checkbox`', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('role')).toEqual('checkbox');

        await disconnect();
    });

    it('should set the `aria-checked` attribute equal to the `checked` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.checked = true;

        await connect();

        expect(element.getAttribute('aria-checked')).toEqual('true');

        element.checked = false;

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-checked')).toEqual('false');

        await disconnect();
    });

    it('should add a class of `checked` when checked is true', async () => {
        const { element, connect, disconnect } = await setup();

        element.checked = true;

        await connect();

        expect(element.classList.contains('checked')).toEqual(true);

        await disconnect();
    });

    it('should set a default `aria-checked` value when `checked` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('aria-checked')).toEqual('false');

        await disconnect();
    });

    it('should set the `aria-required` attribute equal to the `required` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.required = true;

        await connect();

        expect(element.getAttribute('aria-required')).toEqual('true');

        element.required = false;

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-required')).toEqual('false');

        await disconnect();
    });

    it('should set a default `aria-required` value when `required` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('aria-required')).toEqual('false');

        await disconnect();
    });

    it('should set the `aria-disabled` attribute equal to the `disabled` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute('aria-disabled')).toEqual('true');

        element.disabled = false;

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-disabled')).toEqual('false');

        await disconnect();
    });

    it('should set a default `aria-disabled` value when `disabled` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('aria-disabled')).toEqual('false');

        await disconnect();
    });

    it('should set the `aria-readonly` attribute equal to the `readonly` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.readOnly = true;

        await connect();

        expect(element.getAttribute('aria-readonly')).toEqual('true');

        element.readOnly = false;

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-readonly')).toEqual('false');

        await disconnect();
    });

    it('should NOT set a default `aria-readonly` value when `readonly` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('aria-readonly')).toEqual(null);

        await disconnect();
    });

    it('should add a class of `readonly` when readonly is true', async () => {
        const { element, connect, disconnect } = await setup();

        element.readOnly = true;

        await connect();

        expect(element.classList.contains('readonly')).toEqual(true);

        await disconnect();
    });

    it('should set a tabindex of 0 on the element', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('tabindex')).toEqual('0');

        await disconnect();
    });

    it('should NOT set a tabindex when disabled is `true`', async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.hasAttribute('tabindex')).toEqual(false);
        expect(element.getAttribute('tabindex')).toEqual(null);

        await disconnect();
    });

    it('should add a class of `indeterminate` when indeterminate is true', async () => {
        const { element, connect, disconnect } = await setup();

        element.indeterminate = true;

        await connect();

        expect(element.classList.contains('indeterminate')).toEqual(true);

        await disconnect();
    });

    it('should set off `indeterminate` on `checked` change by user click', async () => {
        const { element, connect, disconnect } = await setup();

        element.indeterminate = true;

        await connect();

        element.click();

        expect(element.indeterminate).toBeFalse();

        await disconnect();
    });

    it('should set off `indeterminate` on `checked` change by user keypress', async () => {
        const { element, connect, disconnect } = await setup();

        element.indeterminate = true;

        await connect();

        element.dispatchEvent(new KeyboardEvent('keypress', { key: ' ' }));

        expect(element.indeterminate).toBeFalse();

        await disconnect();
    });

    it('should initialize to the initial value if no value property is set', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        expect(element.value).toEqual(element.initialValue);

        await disconnect();
    });

    it('should initialize to the provided value attribute if set pre-connection', async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute('value', 'foobar');
        await connect();

        expect(element.value).toEqual('foobar');

        await disconnect();
    });

    it('should initialize to the provided value attribute if set post-connection', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        element.setAttribute('value', 'foobar');

        expect(element.value).toEqual('foobar');

        await disconnect();
    });

    it('should initialize to the provided value property if set pre-connection', async () => {
        const { element, connect, disconnect } = await setup();
        element.value = 'foobar';
        await connect();

        expect(element.value).toEqual('foobar');

        await disconnect();
    });

    describe('label', () => {
        it('should add a class of `label` to the internal label when default slotted content exists', async () => {
            const { element, connect, disconnect } = await setup();

            const label = document.createElement('span');
            element.appendChild(label);

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('label')
                    ?.classList.contains('label')
            ).toEqual(true);

            await disconnect();
        });

        it('should add classes of `label` and `label__hidden` to the internal label when default slotted content exists', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('label')
                    ?.classList.contains('label')
            ).toEqual(true);
            expect(
                element.shadowRoot
                    ?.querySelector('label')
                    ?.classList.contains('label__hidden')
            ).toEqual(true);

            await disconnect();
        });
    });

    describe('events', () => {
        it('should fire an event on click', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            const wasClicked = await new Promise(resolve => {
                element.addEventListener('click', () => resolve(true));

                element.click();

                DOM.queueUpdate(() => resolve(false));
            });

            expect(wasClicked).toEqual(true);

            await disconnect();
        });

        it('should fire an event when spacebar is invoked', async () => {
            const { element, connect, disconnect } = await setup();

            const event = new KeyboardEvent('keydown', {
                key: keySpace
            } as KeyboardEventInit);

            await connect();

            const wasInvoked = await new Promise(resolve => {
                element.addEventListener('keydown', () => resolve(true));

                element.dispatchEvent(event);

                // Resolve false on the next update in case the event hasn't happened
                DOM.queueUpdate(() => resolve(false));
            });

            expect(wasInvoked).toEqual(true);

            await disconnect();
        });
    });

    describe('that is required', () => {
        it('should be invalid when unchecked', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();

            element.required = true;
            element.checked = false;

            expect(element.validity.valueMissing).toEqual(true);

            await disconnect();
        });
        it('should be valid when checked', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();

            element.required = true;
            element.checked = true;

            expect(element.validity.valueMissing).toEqual(false);
            await disconnect();
        });
    });

    describe('whose parent form has its reset() method invoked', () => {
        it('should set its checked property to false if the checked attribute is unset', async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.checked = true;

            expect(element.getAttribute('checked')).toBeNull();
            expect(element.checked).toBeTrue();
            form.reset();

            expect(element.checked).toBeFalse();
            await disconnect();
        });

        it('should set its checked property to true if the checked attribute is set', async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.setAttribute('checked', '');

            expect(element.getAttribute('checked')).toEqual('');
            expect(element.checked).toBeTrue();

            element.checked = false;
            expect(element.checked).toBeFalse();
            form.reset();

            expect(element.checked).toBeTrue();
            await disconnect();
        });

        it('should put the control into a clean state, where checked attribute changes change the checked property prior to user or programmatic interaction', async () => {
            const { element, connect, disconnect, parent } = await setup();

            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.checked = true;
            element.removeAttribute('checked');

            expect(element.checked).toBeTrue();

            form.reset();

            expect(element.checked).toBeFalse();

            element.setAttribute('checked', '');

            expect(element.value).toBeTruthy();

            await disconnect();
        });
    });
});
