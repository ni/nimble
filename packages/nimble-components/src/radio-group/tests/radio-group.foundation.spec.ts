// Based on tests in FAST repo: https://github.com/microsoft/fast/blob/913c27e7e8503de1f7cd50bdbc9388134f52ef5d/packages/web-components/fast-foundation/src/radio-group/radio-group.spec.ts

import { DOM } from '@microsoft/fast-element';
import {
    Radio,
    radioTemplate as itemTemplate
} from '@microsoft/fast-foundation';
import { Orientation } from '@microsoft/fast-web-utilities';
import { RadioGroup } from '..';
import { fixture } from '../../utilities/tests/fixture';
import { template } from '../template';
import { radioTag } from '../../radio';

// eslint-disable-next-line @typescript-eslint/naming-convention
const FASTRadioGroup = RadioGroup.compose({
    baseName: 'radio-group',
    template
});

// TODO: Need to add tests for keyboard handling & focus management
describe('Radio Group', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const FASTRadio = Radio.compose({
        baseName: 'radio',
        template: itemTemplate
    });

    async function setup(): Promise<{
        element: RadioGroup,
        connect: () => Promise<void>,
        disconnect: () => Promise<void>,
        parent: HTMLElement,
        radio1: Radio,
        radio2: Radio,
        radio3: Radio
    }> {
        const { element, connect, disconnect, parent } = await fixture([
            FASTRadioGroup(),
            FASTRadio()
        ]);

        const radio1 = document.createElement(radioTag);
        const radio2 = document.createElement(radioTag);
        const radio3 = document.createElement(radioTag);

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        return { element, connect, disconnect, parent, radio1, radio2, radio3 };
    }

    it('should have a role of `radiogroup`', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('role')).toEqual('radiogroup');

        await disconnect();
    });

    it("should set a `horizontal` class on the 'positioning-region' when an orientation of `horizontal` is provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.orientation = Orientation.horizontal;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('.positioning-region')
                ?.classList.contains('horizontal')
        ).toBeTrue();

        await disconnect();
    });

    it("should set a `vertical` class on the 'positioning-region' when an orientation of `vertical` is provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.orientation = Orientation.vertical;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('.positioning-region')
                ?.classList.contains('vertical')
        ).toBeTrue();

        await disconnect();
    });

    it("should set a default class on the 'positioning-region' of `horizontal` when no orientation is provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('.positioning-region')
                ?.classList.contains('horizontal')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `aria-disabled` attribute equal to the `disabled` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute('aria-disabled')).toBe('true');

        element.disabled = false;

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-disabled')).toBe('false');

        await disconnect();
    });

    it('should NOT set a default `aria-disabled` value when `disabled` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('aria-disabled')).toBe(null);

        await disconnect();
    });

    it('should set all child radio elements to disabled when the`disabled` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        element.disabled = true;

        await connect();
        await DOM.nextUpdate();

        expect(element.querySelector<Radio>('.one')!.disabled).toBeTrue();
        expect(element.querySelector<Radio>('.two')!.disabled).toBeTrue();
        expect(element.querySelector<Radio>('.three')!.disabled).toBeTrue();

        expect(
            element.querySelector('.one')?.getAttribute('aria-disabled')
        ).toBe('true');
        expect(
            element.querySelector('.two')?.getAttribute('aria-disabled')
        ).toBe('true');
        expect(
            element.querySelector('.three')?.getAttribute('aria-disabled')
        ).toBe('true');

        await disconnect();
    });

    it('should set the `aria-readonly` attribute equal to the `readonly` value', async () => {
        const { element, connect, disconnect } = await fixture(FASTRadioGroup());

        element.readOnly = true;

        await connect();

        expect(element.getAttribute('aria-readonly')).toBe('true');

        element.readOnly = false;

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-readonly')).toBe('false');

        await disconnect();
    });

    it('should NOT set a default `aria-readonly` value when `readonly` is not defined', async () => {
        const { element, connect, disconnect } = await fixture(FASTRadioGroup());

        await connect();

        expect(element.getAttribute('aria-readonly')).toBe(null);

        await disconnect();
    });

    it('should set all child radio elements to readonly when the`readonly` is passed', async () => {
        const { element, connect, disconnect } = await setup();
        element.readOnly = true;

        await connect();
        await DOM.nextUpdate();

        expect(element.querySelector<Radio>('.one')!.readOnly).toBeTrue();
        expect(element.querySelector<Radio>('.two')!.readOnly).toBeTrue();
        expect(element.querySelector<Radio>('.three')!.readOnly).toBeTrue();

        expect(
            element.querySelector('.one')?.getAttribute('aria-readonly')
        ).toBe('true');
        expect(
            element.querySelector('.two')?.getAttribute('aria-readonly')
        ).toBe('true');
        expect(
            element.querySelector('.three')?.getAttribute('aria-readonly')
        ).toBe('true');

        await disconnect();
    });

    it('should set tabindex of 0 to a child radio with a matching `value`', async () => {
        const { element, connect, disconnect } = await fixture([
            FASTRadioGroup(),
            FASTRadio()
        ]);

        element.value = 'baz';

        const radio1 = document.createElement(radioTag);
        const radio2 = document.createElement(radioTag);
        const radio3 = document.createElement(radioTag);

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        radio1.value = 'foo';
        radio2.value = 'bar';
        radio3.value = 'baz';

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await DOM.nextUpdate();

        expect(
            element.querySelectorAll(radioTag)[2]!.getAttribute('tabindex')
        ).toBe('0');

        await disconnect();
    });

    it('should NOT set tabindex of 0 to a child radio if its value does not match the radiogroup `value`', async () => {
        const { element, connect, disconnect } = await fixture([
            FASTRadioGroup(),
            FASTRadio()
        ]);

        element.value = 'baz';

        const radio1 = document.createElement(radioTag);
        const radio2 = document.createElement(radioTag);
        const radio3 = document.createElement(radioTag);

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        radio1.value = 'foo';
        radio2.value = 'bar';
        radio3.value = 'baz';

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await DOM.nextUpdate();

        expect(
            element.querySelectorAll(radioTag)[0]!.getAttribute('tabindex')
        ).toBe('-1');
        expect(
            element.querySelectorAll(radioTag)[1]!.getAttribute('tabindex')
        ).toBe('-1');

        await disconnect();
    });

    it('should set a child radio with a matching `value` to `checked`', async () => {
        const { element, connect, disconnect } = await fixture([
            FASTRadioGroup(),
            FASTRadio()
        ]);

        element.value = 'baz';

        const radio1 = document.createElement(radioTag);
        const radio2 = document.createElement(radioTag);
        const radio3 = document.createElement(radioTag);

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        radio1.value = 'foo';
        radio2.value = 'bar';
        radio3.value = 'baz';

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await DOM.nextUpdate();

        expect(element.querySelectorAll(radioTag)[2]!.checked).toBeTrue();
        expect(
            element.querySelectorAll(radioTag)[2]!.getAttribute('aria-checked')
        ).toBe('true');

        await disconnect();
    });

    it('should set a child radio with a matching `value` to `checked` when value changes', async () => {
        const { element, connect, disconnect } = await fixture([
            FASTRadioGroup(),
            FASTRadio()
        ]);

        element.value = 'baz';

        const radio1 = document.createElement(radioTag);
        const radio2 = document.createElement(radioTag);
        const radio3 = document.createElement(radioTag);

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        radio1.value = 'foo';
        radio2.value = 'bar';
        radio3.value = 'baz';

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await DOM.nextUpdate();

        element.value = 'foo';

        await DOM.nextUpdate();

        expect(element.querySelectorAll(radioTag)[0]!.checked).toBeTrue();
        expect(
            element.querySelectorAll(radioTag)[0]!.getAttribute('aria-checked')
        ).toBe('true');

        await disconnect();
    });

    it('should mark the last radio defaulted to checked as checked, the rest should not be checked', async () => {
        const { element, connect, disconnect } = await fixture([
            FASTRadioGroup(),
            FASTRadio()
        ]);

        const radio1 = document.createElement(radioTag);
        const radio2 = document.createElement(radioTag);
        const radio3 = document.createElement(radioTag);

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        radio1.value = 'foo';
        radio2.value = 'bar';
        radio3.value = 'baz';

        radio2.setAttribute('checked', '');
        radio3.setAttribute('checked', '');

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await DOM.nextUpdate();

        const radios: NodeList = element.querySelectorAll(radioTag);
        expect((radios[2] as HTMLInputElement).checked).toBeTrue();
        expect((radios[1] as HTMLInputElement).checked).toBeFalse();

        await disconnect();
    });

    it('should mark radio matching value on radio-group over any checked attributes', async () => {
        const { element, connect, disconnect } = await fixture([
            FASTRadioGroup(),
            FASTRadio()
        ]);

        element.value = 'bar';

        const radio1 = document.createElement(radioTag);
        const radio2 = document.createElement(radioTag);
        const radio3 = document.createElement(radioTag);

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        radio1.value = 'foo';
        radio2.value = 'bar';
        radio3.value = 'baz';

        radio2.setAttribute('checked', '');
        radio3.setAttribute('checked', '');

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await DOM.nextUpdate();

        const radios: NodeList = element.querySelectorAll(radioTag);
        expect((radios[1] as HTMLInputElement).checked).toBeTrue();

        // radio-group explicitly sets non-matching radio's checked to false if a value match was found,
        // but the attribute should still persist.
        expect(
            (radios[2] as HTMLInputElement).hasAttribute('checked')
        ).toBeTrue();
        expect((radios[2] as HTMLInputElement).checked).toBeFalse();

        await disconnect();
    });

    it('should NOT set a child radio to `checked` if its value does not match the radiogroup `value`', async () => {
        const { element, connect, disconnect } = await fixture([
            FASTRadioGroup(),
            FASTRadio()
        ]);

        element.value = 'baz';

        const radio1 = document.createElement(radioTag);
        const radio2 = document.createElement(radioTag);
        const radio3 = document.createElement(radioTag);

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        radio1.value = 'foo';
        radio2.value = 'bar';
        radio3.value = 'baz';

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await DOM.nextUpdate();

        expect(element.querySelectorAll(radioTag)[0]!.checked).toBeFalse();
        expect(
            element.querySelectorAll(radioTag)[0]!.getAttribute('aria-checked')
        ).toBe('false');

        expect(element.querySelectorAll(radioTag)[1]!.checked).toBeFalse();
        expect(
            element.querySelectorAll(radioTag)[1]!.getAttribute('aria-checked')
        ).toBe('false');

        await disconnect();
    });

    it('should allow resetting of elements by the parent form', async () => {
        const { element, connect, disconnect, parent, radio1, radio2, radio3 } = await setup();

        radio2.setAttribute('checked', '');

        const form = document.createElement('form');
        form.appendChild(element);
        parent.appendChild(form);

        await connect();

        radio1.checked = true;

        expect(!!radio1.checked).toBeTrue();
        expect(!!radio2.checked).toBeFalse();
        expect(!!radio3.checked).toBeFalse();

        form.reset();

        expect(!!radio1.checked).toBeFalse();
        expect(!!radio2.checked).toBeTrue();
        expect(!!radio3.checked).toBeFalse();

        await disconnect();
    });
});
