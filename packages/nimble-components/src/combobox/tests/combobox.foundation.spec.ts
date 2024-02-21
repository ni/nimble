// Based on tests in FAST repo: https://github.com/microsoft/fast/blob/085cb27d348ed6f59d080c167fa62aeaa1e3940e/packages/web-components/fast-foundation/src/combobox/combobox.spec.ts
import {
    ComboboxAutocomplete,
    ListboxOption,
    listboxOptionTemplate
} from '@microsoft/fast-foundation';
import {
    keyArrowDown,
    keyArrowUp,
    keyEnter
} from '@microsoft/fast-web-utilities';
import { Combobox } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture } from '../../utilities/tests/fixture';
import { template } from '../template';

describe('Combobox', () => {
    const combobox = Combobox.compose({
        baseName: 'combobox',
        template
    });

    const option = ListboxOption.compose({
        baseName: 'option',
        template: listboxOptionTemplate
    });

    async function setup(): Promise<{
        element: Combobox,
        connect: () => Promise<void>,
        disconnect: () => Promise<void>,
        document: Document,
        option1: ListboxOption,
        option2: ListboxOption,
        option3: ListboxOption,
        parent: HTMLElement
    }> {
        const { element, connect, disconnect, parent } = await fixture([
            combobox(),
            option()
        ]);

        element.id = 'combobox';

        const option1 = document.createElement('fast-option') as ListboxOption;
        option1.textContent = 'one';

        const option2 = document.createElement('fast-option') as ListboxOption;
        option2.textContent = 'two';

        const option3 = document.createElement('fast-option') as ListboxOption;
        option3.textContent = 'three';

        element.appendChild(option1);
        element.appendChild(option2);
        element.appendChild(option3);

        return {
            element,
            connect,
            disconnect,
            document,
            option1,
            option2,
            option3,
            parent
        };
    }

    it('should include a control with a role of `combobox`', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.control).toBeDefined();

        expect(element.control.getAttribute('role')).toEqual('combobox');

        await disconnect();
    });

    it('should set the `aria-disabled` attribute equal to the `disabled` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute('aria-disabled')).toEqual('true');

        element.disabled = false;

        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-disabled')).toEqual('false');

        await disconnect();
    });

    it('should have a tabindex of 0 when `disabled` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('tabindex')).toEqual('0');

        await disconnect();
    });

    it('should NOT have a tabindex when `disabled` is true', async () => {
        const { element, connect, disconnect } = await setup();
        element.disabled = true;

        await connect();

        expect(element.getAttribute('tabindex')).toEqual(null);

        await disconnect();
    });

    it('should NOT set its value to the first available option', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.value).toEqual('');

        await disconnect();
    });

    it('should set its value to the first option with the `selected` attribute present', async () => {
        const { element, connect, disconnect, option2 } = await setup();

        option2.setAttribute('selected', '');

        expect(option2.selected).toBeTrue();

        await connect();

        expect(element.value).toEqual('two');

        await disconnect();
    });

    it('should return the same value when the value property is set before connect', async () => {
        const { element, connect, disconnect } = await setup();

        element.value = 'two';

        expect(element.value).toEqual('two');

        await connect();

        await disconnect();
    });

    it('should return the same value when the value property is set after connect', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.value = 'two';

        expect(element.value).toEqual('two');

        await disconnect();
    });

    it('should display the listbox when the `open` property is true before connecting', async () => {
        const { element, connect, disconnect } = await setup();

        element.open = true;

        await connect();

        expect(element.hasAttribute('open')).toBeTrue();

        await disconnect();
    });

    it("should NOT emit a 'change' event when the user presses Enter without changing value", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.value = 'two';

        const event = new KeyboardEvent('keydown', {
            key: keyEnter
        } as KeyboardEventInit);

        const wasChanged = await Promise.race([
            new Promise(resolve => {
                element.addEventListener('change', () => resolve(true));
                element.dispatchEvent(event);
            }),
            waitForUpdatesAsync().then(() => false)
        ]);

        expect(wasChanged).toBeFalse();

        await disconnect();
    });

    const autocompleteModes: ComboboxAutocomplete[] = [
        'none',
        'list',
        'inline',
        'both'
    ];
    autocompleteModes.forEach(mode => {
        it(`should update value to entered non-option value after selecting an option value for autocomplete mode: ${mode}`, async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = 'two';

            const enterEvent = new KeyboardEvent('keydown', {
                key: keyEnter
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));

                    // fake a key entered value
                    element.control.value = 'a';
                    element.control.dispatchEvent(
                        new InputEvent('input', {
                            data: 'a',
                            inputType: 'insertText'
                        })
                    );

                    element.dispatchEvent(enterEvent);
                }),
                waitForUpdatesAsync().then(() => false)
            ]);

            expect(wasChanged).toBeTrue();
            expect(element.value).toEqual('a');

            await disconnect();
        });
    });

    it("should emit a 'change' event when the user clicks away after selecting option in dropdown", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.click(); // open dropdown

        const keyDownEvent = new KeyboardEvent('keydown', {
            key: keyArrowDown
        } as KeyboardEventInit);
        element.dispatchEvent(keyDownEvent);
        await waitForUpdatesAsync();

        const wasChanged = await Promise.race([
            new Promise(resolve => {
                element.addEventListener('change', () => resolve(true));

                // fake focusout handling
                element.dispatchEvent(
                    new FocusEvent('focusout', { relatedTarget: element })
                );
            }),
            waitForUpdatesAsync().then(() => false)
        ]);

        expect(wasChanged).toBeTrue();

        await disconnect();
    });

    describe("should NOT emit a 'change' event when the value changes by user input while open", () => {
        it('via arrow down key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).toBeTrue();

            const event = new KeyboardEvent('keydown', {
                key: keyArrowDown
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                waitForUpdatesAsync().then(() => false)
            ]);

            expect(wasChanged).toBeFalse();

            await disconnect();
        });

        it('via arrow up key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = 'two';

            expect(element.value).toEqual('two');

            element.click();

            expect(element.open).toBeTrue();

            const event = new KeyboardEvent('keydown', {
                key: keyArrowUp
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                waitForUpdatesAsync().then(() => false)
            ]);

            expect(wasChanged).toBeFalse();

            expect(element.value).toEqual('two');

            await disconnect();
        });
    });

    describe("should NOT emit a 'change' event when the value changes by programmatic interaction", () => {
        it('via end key', async () => {
            const { element, connect, disconnect } = await setup();

            element.value = 'one';

            await connect();

            expect(element.value).toEqual('one');

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));

                    element.value = 'two';
                }),
                waitForUpdatesAsync().then(() => false)
            ]);

            expect(wasChanged).toBeFalse();

            expect(element.value).toEqual('two');

            await disconnect();
        });
    });

    it('should set the `placeholder` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const placeholder = 'placeholder';

        element.placeholder = placeholder;

        await connect();
        expect(
            element.shadowRoot
                ?.querySelector('.selected-value')
                ?.getAttribute('placeholder')
        ).toEqual(placeholder);

        await disconnect();
    });

    describe("when the owning form's reset() function is invoked", () => {
        it('should reset the value property to its initial value', async () => {
            const { connect, disconnect, element, parent } = await setup();

            element.value = 'one';

            const form = document.createElement('form');

            form.appendChild(element);

            parent.appendChild(form);

            await connect();

            element.value = 'two';

            expect(element.value).toEqual('two');

            form.reset();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('should reset its value property to the first option with the `selected` attribute present', async () => {
            const { element, connect, disconnect, parent, option2 } = await setup();

            option2.setAttribute('selected', '');

            const form = document.createElement('form');

            form.appendChild(element);

            parent.appendChild(form);

            await connect();

            expect(element.value).toEqual('two');

            element.value = 'one';

            expect(element.value).toEqual('one');

            form.reset();

            await waitForUpdatesAsync();

            expect(element.value).toEqual('two');

            await disconnect();
        });
    });

    it('should focus the control when an associated label is clicked', async () => {
        const { element, connect, disconnect, parent } = await setup();

        const label = document.createElement('label');
        label.setAttribute('for', element.id);

        parent.insertBefore(label, element);

        await connect();
        // await waitForUpdatesAsync();

        expect(element.labels as unknown as Node[]).toContain(label);

        label.click();

        expect(document.activeElement).toEqual(element);

        await disconnect();
    });

    it("should set the control's `aria-activedescendant` property to the ID of the currently selected option while open", async () => {
        const {
            connect, disconnect, element, option1, option2, option3
        } = await setup();

        await connect();

        await waitForUpdatesAsync();

        expect(element.control).toBeDefined();

        expect(option1.id).toBeDefined();

        expect(option2.id).toBeDefined();

        expect(option3.id).toBeDefined();

        expect(
            element.control.getAttribute('aria-activedescendant')
        ).toBeNull();

        element.open = true;

        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-activedescendant')).toEqual(
            ''
        );

        element.selectNextOption();

        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-activedescendant')).toEqual(
            option1.id
        );

        element.selectNextOption();

        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-activedescendant')).toEqual(
            option2.id
        );

        element.selectNextOption();

        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-activedescendant')).toEqual(
            option3.id
        );

        element.value = 'other';

        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-activedescendant')).toEqual(
            ''
        );

        await disconnect();
    });

    it("should set the control's `aria-controls` attribute to the ID of the internal listbox element while open", async () => {
        const { connect, disconnect, element } = await setup();

        await connect();

        expect(element.control).toBeDefined();

        expect(element.listbox).toBeDefined();

        const listboxId = element.listbox.id;

        expect(element.control.getAttribute('aria-controls')).toBeDefined();

        expect(element.control.getAttribute('aria-controls')).toEqual('');

        element.open = true;

        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-controls')).toEqual(
            listboxId
        );

        element.open = false;

        await waitForUpdatesAsync();

        expect(element.control.getAttribute('aria-controls')).toEqual('');

        await disconnect();
    });

    const noInlineAutocompleteModes: ComboboxAutocomplete[] = ['none', 'list'];
    noInlineAutocompleteModes.forEach(mode => {
        it(`when autocomplete is ${mode}, typing should select exact match`, async () => {
            const { connect, disconnect, element, option2, option3 } = await setup();

            await connect();

            element.autocomplete = mode;

            expect(option2.selected).toBeFalse();

            // fake a key entered value
            element.control.value = 't';
            element.control.dispatchEvent(
                new InputEvent('input', { data: 't', inputType: 'insertText' })
            );

            expect(option2.selected).toBeFalse(); // 'two' not selected
            expect(option3.selected).toBeFalse(); // 'three' not selected

            element.control.value = 'tw';
            element.control.dispatchEvent(
                new InputEvent('input', { data: 'w', inputType: 'insertText' })
            );

            element.control.value = 'two';
            element.control.dispatchEvent(
                new InputEvent('input', { data: 'o', inputType: 'insertText' })
            );

            expect(option2.selected).toBeTrue();

            element.control.value = 'twos';
            element.control.dispatchEvent(
                new InputEvent('input', { data: 's', inputType: 'insertText' })
            );

            expect(option2.selected).toBeFalse();

            element.control.value = 'two';
            element.control.dispatchEvent(
                new InputEvent('input', { inputType: 'deleteContentBackward' })
            );

            expect(option2.selected).toBeTrue();

            await disconnect();
        });
    });

    it("should reset control's value when user selects current value after typing", async () => {
        const { connect, disconnect, element } = await setup();

        await connect();

        element.value = 'three';
        element.autocomplete = 'list';

        await waitForUpdatesAsync();

        expect(element.control).toBeDefined();

        element.control.value = 't';
        element.control.dispatchEvent(
            new InputEvent('input', { inputType: 'deleteContentBackward' })
        ); // filter dropdown
        element.open = false;

        const keyDownEvent = new KeyboardEvent('keydown', {
            key: keyArrowDown
        } as KeyboardEventInit);
        element.dispatchEvent(keyDownEvent); // open dropdown

        await waitForUpdatesAsync();
        expect(element.hasAttribute('open')).toBeTrue();

        element.dispatchEvent(keyDownEvent); // select "two"
        element.dispatchEvent(keyDownEvent); // select "three"

        const enterEvent = new KeyboardEvent('keydown', {
            key: keyEnter
        } as KeyboardEventInit);
        element.dispatchEvent(enterEvent); // commit value

        expect(element.control.value).toEqual('three');

        await disconnect();
    });
});
