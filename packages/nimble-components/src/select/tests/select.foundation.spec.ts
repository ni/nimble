/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/quotes */
import { DOM } from '@microsoft/fast-element';
import {
    ListboxOption,
    listboxOptionTemplate
} from '@microsoft/fast-foundation';
import {
    keyArrowDown,
    keyArrowUp,
    keyEnd,
    keyHome
} from '@microsoft/fast-web-utilities';
import { Select } from '..';
import { fixture } from '../../utilities/tests/fixture';
import { template } from '../template';

/**
 * Timeout for use in async tets.
 */
export async function timeout(ms = 0): Promise<void> {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            // eslint-disable-next-line no-void
            resolve(void 0);
        }, ms);
    });
}

describe('Select', () => {
    const FASTSelect = Select.compose({
        baseName: 'select',
        template
    });

    const FASTOption = ListboxOption.compose({
        baseName: 'option',
        template: listboxOptionTemplate
    });

    async function setup() {
        const { element, connect, disconnect, parent } = await fixture([
            FASTSelect(),
            FASTOption()
        ]);

        const option1 = document.createElement('fast-option') as ListboxOption;
        option1.value = 'one';
        option1.textContent = 'option one';

        const option2 = document.createElement('fast-option') as ListboxOption;
        option2.value = 'two';
        option2.textContent = 'option two';

        const option3 = document.createElement('fast-option') as ListboxOption;
        option3.value = 'three';
        option3.textContent = 'option three';

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

    it('should have a role of `combobox`', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('role')).toEqual('combobox');

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

    it('should have a tabindex of 0 when `disabled` is not defined', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('tabindex')).toEqual('0');

        await disconnect();
    });

    it('should have the attribute aria-expanded set to false', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('aria-expanded')).toEqual('false');

        await disconnect();
    });

    it('should NOT have a tabindex when `disabled` is true', async () => {
        const { element, connect, disconnect } = await setup();
        element.disabled = true;

        await connect();

        expect(element.getAttribute('tabindex')).toEqual(null);

        await disconnect();
    });

    it('should set its value to the first enabled option', async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();

        await connect();

        expect(element.value).toEqual('one');
        expect(element.selectedIndex).toEqual(0);

        expect(element.selectedOptions).toContain(option1);
        expect(element.selectedOptions).not.toContain(option2);
        expect(element.selectedOptions).not.toContain(option3);

        await disconnect();
    });

    it('should set its value to the first enabled option when disabled', async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();
        element.disabled = true;

        await connect();

        expect(element.value).toEqual('one');
        expect(element.selectedIndex).toEqual(0);

        expect(element.selectedOptions).toContain(option1);
        expect(element.selectedOptions).not.toContain(option2);
        expect(element.selectedOptions).not.toContain(option3);

        await disconnect();
    });

    it('should select the first option with a `selected` attribute', async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();

        option2.setAttribute('selected', '');

        await connect();

        expect(element.value).toEqual('two');
        expect(element.selectedIndex).toEqual(1);

        expect(element.selectedOptions).not.toContain(option1);
        expect(element.selectedOptions).toContain(option2);
        expect(element.selectedOptions).not.toContain(option3);

        await disconnect();
    });

    it('should select the first option with a `selected` attribute when disabled', async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();
        element.disabled = true;

        option2.setAttribute('selected', '');

        await connect();

        expect(element.value).toEqual('two');
        expect(element.selectedIndex).toEqual(1);

        expect(element.selectedOptions).not.toContain(option1);
        expect(element.selectedOptions).toContain(option2);
        expect(element.selectedOptions).not.toContain(option3);

        await disconnect();
    });

    it('should return the same value when the value property is set before connect', async () => {
        const { element } = await setup();

        element.value = 'two';

        expect(element.value).toEqual('two');
    });

    it('should return the same value when the value property is set during connect', async () => {
        const { element, connect, disconnect } = await setup();

        const connectTask = connect();
        element.value = 'two';
        await connectTask;

        expect(element.value).toEqual('two');

        await disconnect();
    });

    it('should return the same value when the value property is set after connect', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.value = 'two';

        expect(element.value).toEqual('two');

        await disconnect();
    });

    it('should select the next selectable option when the value is set to match a disabled option', async () => {
        const { element, connect, disconnect, option2 } = await setup();

        option2.disabled = true;

        await connect();

        expect(element.value).toEqual('one');
        expect(element.selectedIndex).toEqual(0);

        element.value = 'two';

        expect(element.value).toEqual('three');
        expect(element.selectedIndex).toEqual(2);

        await disconnect();
    });

    it("should update the value when the selected option's value changes", async () => {
        const { element, connect, disconnect, option1 } = await setup();

        await connect();

        expect(element.value).toEqual('one');

        option1.value = 'new value';

        expect(element.value).toEqual('new value');

        await disconnect();
    });

    it('should return the value as a string', async () => {
        const { element, connect, disconnect, option1 } = await setup();

        await connect();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        option1.value = 12345 as any;

        expect(element.value).toEqual('12345');

        expect(typeof element.value).toEqual('string');

        await disconnect();
    });

    it('should update the aria-expanded attribute when opened', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.click();

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-expanded')).toEqual('true');

        await disconnect();
    });

    it('should display the listbox when the `open` property is true before connecting', async () => {
        const { element, connect, disconnect } = await setup();

        element.open = true;

        await connect();

        expect(element.hasAttribute('open')).toBeTrue();

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
                DOM.nextUpdate().then(() => false)
            ]);

            expect(wasChanged).toBeFalse();

            expect(element.value).toEqual('two');

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
                DOM.nextUpdate().then(() => false)
            ]);

            expect(wasChanged).toBeFalse();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('via home key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).toBeTrue();

            const event = new KeyboardEvent('keydown', {
                key: keyHome
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                DOM.nextUpdate().then(() => false)
            ]);

            expect(wasChanged).toBeFalse();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('via end key', async () => {
            const { element, connect, disconnect } = await setup();

            element.value = 'one';

            await connect();

            element.click();

            expect(element.open).toBeTrue();

            const event = new KeyboardEvent('keydown', {
                key: keyEnd
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                DOM.nextUpdate().then(() => false)
            ]);

            expect(wasChanged).toBeFalse();

            expect(element.value).toEqual('three');

            await disconnect();
        });
    });

    describe("should NOT emit an 'input' event when the value changes by user input while open", () => {
        it('via arrow down key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).toBeTrue();

            const event = new KeyboardEvent('keydown', {
                key: keyArrowDown
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('input', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false)
            ]);

            expect(wasInput).toBeFalse();

            expect(element.value).toEqual('two');

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

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('input', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false)
            ]);

            expect(wasInput).toBeFalse();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('via home key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).toBeTrue();

            const event = new KeyboardEvent('keydown', {
                key: 'Home'
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('input', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false)
            ]);

            expect(wasInput).toBeFalse();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('via end key', async () => {
            const { element, connect, disconnect } = await setup();

            element.value = 'one';

            await connect();

            element.click();

            expect(element.open).toBeTrue();

            const event = new KeyboardEvent('keydown', {
                key: keyEnd
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('input', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false)
            ]);

            expect(wasInput).toBeFalse();

            expect(element.value).toEqual('three');

            await disconnect();
        });
    });

    describe("should emit a 'change' event when the value changes by user input while closed", () => {
        it('via arrow down key', async () => {
            const { element, connect, disconnect } = await setup();

            element.value = 'one';

            await connect();

            expect(element.value).toEqual('one');

            expect(element.open).toBeFalse();

            const event = new KeyboardEvent('keydown', {
                key: keyArrowDown
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                DOM.nextUpdate().then(() => false)
            ]);

            expect(wasChanged).toBeTrue();

            expect(element.value).toEqual('two');

            await disconnect();
        });

        it('via arrow up key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = 'two';

            expect(element.value).toEqual('two');

            expect(element.open).toBeFalse();

            const event = new KeyboardEvent('keydown', {
                key: keyArrowUp
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                DOM.nextUpdate().then(() => false)
            ]);

            expect(wasChanged).toBeTrue();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('via home key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = 'three';

            expect(element.value).toEqual('three');

            expect(element.open).toBeFalse();

            const event = new KeyboardEvent('keydown', {
                key: keyHome
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                DOM.nextUpdate().then(() => false)
            ]);

            expect(wasChanged).toBeTrue();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('via end key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(element.open).toBeFalse();

            const event = new KeyboardEvent('keydown', {
                key: keyEnd
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('change', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                DOM.nextUpdate().then(() => false)
            ]);

            expect(wasChanged).toBeTrue();

            expect(element.value).toEqual('three');

            await disconnect();
        });

        // eslint-disable-next-line func-names, prefer-arrow-callback
        it('with a sequence of directional inputs', async function () {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = 'two';

            expect(element.value).toEqual('two');

            element.click();
            element.click();

            expect(element.open).toBeFalse();

            const arrowDownEvent = new KeyboardEvent('keydown', {
                key: keyArrowDown
            } as KeyboardEventInit);

            const arrowUpEvent = new KeyboardEvent('keydown', {
                key: keyArrowUp
            } as KeyboardEventInit);

            expect(
                await Promise.race([
                    new Promise(resolve => {
                        element.addEventListener(
                            'change',
                            () => resolve(true),
                            { once: true }
                        );
                        element.dispatchEvent(arrowUpEvent);
                    }),
                    timeout().then(() => false)
                ])
            ).toBeTrue();

            expect(element.value).toEqual('one');

            expect(
                await Promise.race([
                    new Promise(resolve => {
                        element.addEventListener(
                            'change',
                            () => resolve(true),
                            { once: true }
                        );
                        element.dispatchEvent(arrowDownEvent);
                    }),
                    timeout().then(() => false)
                ])
            ).toBeTrue();

            expect(element.value).toEqual('two');

            await disconnect();
        });
    });

    describe("should emit an 'input' event when the value changes by user input while closed", () => {
        it('via arrow down key', async () => {
            const { element, connect, disconnect } = await setup();

            element.value = 'one';

            await connect();

            expect(element.value).toEqual('one');

            expect(element.open).toBeFalse();

            const event = new KeyboardEvent('keydown', {
                key: keyArrowDown
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('input', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false)
            ]);

            expect(wasInput).toBeTrue();

            expect(element.value).toEqual('two');

            await disconnect();
        });

        it('via arrow up key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = 'two';

            expect(element.value).toEqual('two');

            expect(element.open).toBeFalse();

            const event = new KeyboardEvent('keydown', {
                key: keyArrowUp
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('input', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false)
            ]);

            expect(wasInput).toBeTrue();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('via home key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = 'three';

            expect(element.value).toEqual('three');

            expect(element.open).toBeFalse();

            const event = new KeyboardEvent('keydown', {
                key: keyHome
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('input', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false)
            ]);

            expect(wasInput).toBeTrue();

            expect(element.value).toEqual('one');

            await disconnect();
        });

        it('via end key', async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(element.open).toBeFalse();

            const event = new KeyboardEvent('keydown', {
                key: 'End'
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener('input', () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false)
            ]);

            expect(wasInput).toBeTrue();

            expect(element.value).toEqual('three');

            await disconnect();
        });
    });

    it("should NOT emit a 'change' event when the value changes by programmatic interaction", async () => {
        const { element, connect, disconnect } = await setup();

        element.value = 'one';

        await connect();

        expect(element.value).toEqual('one');

        const wasChanged = await Promise.race([
            new Promise(resolve => {
                element.addEventListener('change', () => resolve(true));

                element.value = 'two';
            }),
            DOM.nextUpdate().then(() => false)
        ]);

        expect(wasChanged).toBeFalse();

        expect(element.value).toEqual('two');

        await disconnect();
    });

    it("should NOT emit an 'input' event when the value changes by programmatic interaction", async () => {
        const { element, connect, disconnect } = await setup();

        element.value = 'one';

        await connect();

        expect(element.value).toEqual('one');

        const wasChanged = await Promise.race([
            new Promise(resolve => {
                element.addEventListener('input', () => resolve(true));

                element.value = 'two';
            }),
            DOM.nextUpdate().then(() => false)
        ]);

        expect(wasChanged).toBeFalse();

        expect(element.value).toEqual('two');

        await disconnect();
    });

    describe("when the owning form's reset() function is invoked", () => {
        it('should reset the value property to the first enabled option', async () => {
            const { connect, disconnect, element, parent } = await setup();

            element.value = 'one';

            const form = document.createElement('form');

            form.appendChild(element);

            parent.appendChild(form);

            await connect();

            expect(element.value).toEqual('one');

            element.value = 'two';

            expect(element.value).toEqual('two');

            form.reset();

            expect(element.value).toEqual('one');

            await disconnect();
        });
    });

    it('should set the `aria-activedescendant` attribute to the ID of the currently selected option', async () => {
        const { connect, disconnect, element, option1, option2, option3 } = await setup();

        await connect();

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-activedescendant')).toEqual(
            option1.id
        );

        element.selectNextOption();

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-activedescendant')).toEqual(
            option2.id
        );

        element.selectNextOption();

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-activedescendant')).toEqual(
            option3.id
        );

        await disconnect();
    });

    it('should set the `aria-controls` attribute to the ID of the internal listbox element while open', async () => {
        const { connect, disconnect, element } = await setup();

        await connect();

        expect(element.listbox).toBeDefined();

        const listboxId = element.listbox.id;

        expect(element.getAttribute('aria-controls')).toEqual('');

        element.open = true;

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-controls')).toEqual(listboxId);

        element.open = false;

        await DOM.nextUpdate();

        expect(element.getAttribute('aria-controls')).toEqual('');

        await disconnect();
    });

    describe("should update the `displayValue` when the selected option's content changes", () => {
        it('via innerHTML', async () => {
            const { connect, disconnect, element, option1 } = await setup();

            await connect();

            expect(element.displayValue).toEqual('option one');

            option1.innerHTML = 'new value';

            expect(element.displayValue).toEqual('new value');

            await disconnect();
        });

        it('via innerText', async () => {
            const { connect, disconnect, element, option1 } = await setup();

            await connect();

            expect(element.displayValue).toEqual('option one');

            option1.innerText = 'new value';

            expect(element.displayValue).toEqual('new value');

            await disconnect();
        });

        it('via textContent', async () => {
            const { connect, disconnect, element, option1 } = await setup();

            await connect();

            expect(element.displayValue).toEqual('option one');

            option1.textContent = 'new value';

            expect(element.displayValue).toEqual('new value');

            await disconnect();
        });
    });
});
