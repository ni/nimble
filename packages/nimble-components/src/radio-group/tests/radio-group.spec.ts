import {
    DesignSystem,
    RadioGroup as FoundationRadioGroup
} from '@microsoft/fast-foundation';
import { DOM } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import { fixture } from '../../utilities/tests/fixture';
import { RadioGroup } from '..';
import { RadioButton } from '../../radio-button';

describe('Radio Group', () => {
    it('should have its tag returned by tagFor(FoundationRadioGroup)', () => {
        expect(DesignSystem.tagFor(FoundationRadioGroup)).toBe(
            'nimble-radio-group'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-radio-group')).toBeInstanceOf(
            RadioGroup
        );
    });

    async function setup(): Promise<{
        parent: HTMLElement,
        element: RadioGroup,
        connect: () => Promise<void>,
        disconnect: () => Promise<void>,
        radio1: RadioButton,
        radio2: RadioButton,
        radio3: RadioButton
    }> {
        const { element, connect, disconnect, parent } = await fixture<RadioGroup>(DesignSystem.tagFor(RadioGroup));

        const radio1 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio2 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio3 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;

        radio1.className = 'one';
        radio2.className = 'two';
        radio3.className = 'three';

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        return {
            element,
            connect,
            disconnect,
            parent,
            radio1,
            radio2,
            radio3
        };
    }

    it('should have a role of `radiogroup`', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot?.querySelector('div')?.getAttribute('role')
        ).toBe('radiogroup');

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

        expect(
            element.shadowRoot
                ?.querySelector('div')
                ?.getAttribute('aria-disabled')
        ).toBe('true');

        element.disabled = false;

        await DOM.nextUpdate();

        expect(
            element.shadowRoot
                ?.querySelector('div')
                ?.getAttribute('aria-disabled')
        ).toBe('false');

        await disconnect();
    });

    it('should NOT set a default `aria-disabled` value when `disabled` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('div')
                ?.getAttribute('aria-disabled')
        ).toBe(null);

        await disconnect();
    });

    it('should set all child radio elements to disabled when the `disabled` attribute is present', async () => {
        const {
            element, connect, disconnect, radio1, radio2, radio3
        } = await setup();
        element.disabled = true;

        await connect();
        await DOM.nextUpdate();

        expect(radio1.disabled).toBeTrue();
        expect(radio2.disabled).toBeTrue();
        expect(radio3.disabled).toBeTrue();

        expect(radio1.getAttribute('aria-disabled')).toBe('true');
        expect(radio2.getAttribute('aria-disabled')).toBe('true');
        expect(radio3.getAttribute('aria-disabled')).toBe('true');

        await disconnect();
    });

    it('should set the `aria-readonly` attribute equal to the `readonly` value', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        element.readOnly = true;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('div')
                ?.getAttribute('aria-readonly')
        ).toBe('true');

        element.readOnly = false;

        await DOM.nextUpdate();

        expect(
            element.shadowRoot
                ?.querySelector('div')
                ?.getAttribute('aria-readonly')
        ).toBe('false');

        await disconnect();
    });

    it('should NOT set a default `aria-readonly` value when `readonly` is not defined', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('div')
                ?.getAttribute('aria-readonly')
        ).toBe(null);

        await disconnect();
    });

    it('should set all child radio elements to readonly when the`readonly` is passed', async () => {
        const {
            element, connect, disconnect, radio1, radio2, radio3
        } = await setup();
        element.readOnly = true;

        await connect();
        await DOM.nextUpdate();

        expect(radio1.readOnly).toBeTrue();
        expect(radio2.readOnly).toBeTrue();
        expect(radio3.readOnly).toBeTrue();

        expect(radio1.getAttribute('aria-readonly')).toBe('true');
        expect(radio2.getAttribute('aria-readonly')).toBe('true');
        expect(radio3.getAttribute('aria-readonly')).toBe('true');

        await disconnect();
    });

    it('should set tabindex of 0 to a child radio with a matching `value`', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        element.value = 'baz';

        const radio1 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio2 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio3 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;

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
            element
                .querySelectorAll(DesignSystem.tagFor(RadioButton))[2]!
                .getAttribute('tabindex')
        ).toBe('0');

        await disconnect();
    });

    it('should NOT set tabindex of 0 to a child radio if its value does not match the radiogroup `value`', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        element.value = 'baz';

        const radio1 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio2 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio3 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;

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
            element
                .querySelectorAll(DesignSystem.tagFor(RadioButton))[0]!
                .getAttribute('tabindex')
        ).toBe('-1');
        expect(
            element
                .querySelectorAll(DesignSystem.tagFor(RadioButton))[1]!
                .getAttribute('tabindex')
        ).toBe('-1');

        await disconnect();
    });

    it('should set a child radio with a matching `value` to `checked`', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        element.value = 'baz';

        const radio1 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio2 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio3 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;

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
            (
                element.querySelectorAll(
                    DesignSystem.tagFor(RadioButton)
                )[2] as RadioButton
            ).checked
        ).toBe(true);
        expect(
            element
                .querySelectorAll(DesignSystem.tagFor(RadioButton))[2]!
                .getAttribute('aria-checked')
        ).toBe('true');

        await disconnect();
    });

    it('should set a child radio with a matching `value` to `checked` when value changes', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        element.value = 'baz';

        const radio1 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio2 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio3 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;

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

        expect(
            (
                element.querySelectorAll(
                    DesignSystem.tagFor(RadioButton)
                )[0] as RadioButton
            ).checked
        ).toBe(true);
        expect(
            element
                .querySelectorAll(DesignSystem.tagFor(RadioButton))[0]!
                .getAttribute('aria-checked')
        ).toBe('true');

        await disconnect();
    });

    it('should mark the last radio defaulted to checked as checked, the rest should not be checked', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        const radio1 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio2 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio3 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;

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

        const radios: NodeList = element.querySelectorAll(
            DesignSystem.tagFor(RadioButton)
        );
        expect((radios[2] as HTMLInputElement).checked).toBeTrue();
        expect((radios[1] as HTMLInputElement).checked).toBe(false);

        await disconnect();
    });

    it('should mark radio matching value on radio-group over any checked attributes', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        element.value = 'bar';

        const radio1 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio2 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio3 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;

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

        const radios: NodeList = element.querySelectorAll(
            DesignSystem.tagFor(RadioButton)
        );
        expect((radios[1] as HTMLInputElement).checked).toBeTrue();

        // radio-group explicitly sets non-matching radio's checked to false if a value match was found,
        // but the attribute should still persist.
        expect(
            (radios[2] as HTMLInputElement).hasAttribute('checked')
        ).toBeTrue();
        expect((radios[2] as HTMLInputElement).checked).toBe(false);

        await disconnect();
    });

    it('should NOT set a child radio to `checked` if its value does not match the radiogroup `value`', async () => {
        const { element, connect, disconnect } = await fixture<RadioGroup>(
            DesignSystem.tagFor(RadioGroup)
        );

        element.value = 'baz';

        const radio1 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio2 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;
        const radio3 = document.createElement(
            DesignSystem.tagFor(RadioButton)
        ) as RadioButton;

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
            (
                element.querySelectorAll(
                    DesignSystem.tagFor(RadioButton)
                )[0] as RadioButton
            ).checked
        ).toBe(false);
        expect(
            element
                .querySelectorAll(DesignSystem.tagFor(RadioButton))[0]!
                .getAttribute('aria-checked')
        ).toBe('false');

        expect(
            (
                element.querySelectorAll(
                    DesignSystem.tagFor(RadioButton)
                )[1] as RadioButton
            ).checked
        ).toBe(false);
        expect(
            element
                .querySelectorAll(DesignSystem.tagFor(RadioButton))[1]!
                .getAttribute('aria-checked')
        ).toBe('false');

        await disconnect();
    });

    it('should allow resetting of elements by the parent form', async () => {
        const {
            element, connect, disconnect, parent, radio1, radio2, radio3
        } = await setup();

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
