import { DOM } from '@ni/fast-element';
import { NumberField } from '..';
import { template } from '../template';
import { fixture } from '../../utilities/tests/fixture';

const fastNumberField = class TestNumberField extends NumberField {}.compose({
    baseName: 'number-field',
    template
});

async function setup(props?: Partial<NumberField>): Promise<{
    element: NumberField,
    connect: () => Promise<void>,
    disconnect: () => Promise<void>,
    parent: HTMLElement
}> {
    const { element, connect, disconnect, parent } = await fixture(fastNumberField());

    if (props) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
                (element as any)[key] = (props as any)[key].toString();
            }
        }
    }

    await connect();

    return { element, connect, disconnect, parent };
}

describe('NumberField', () => {
    it('should set the `autofocus` attribute on the internal control equal to the value provided', async () => {
        const { element, disconnect } = await setup({ autofocus: true });

        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('autofocus')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `disabled` attribute on the internal control equal to the value provided', async () => {
        const { element, disconnect } = await setup({ disabled: true });

        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('disabled')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `list` attribute on the internal control equal to the value provided', async () => {
        const list = 'listId';
        const { element, disconnect } = await setup({ list });

        expect(
            element.shadowRoot!.querySelector('.control')?.getAttribute('list')
        ).toBe(list);

        await disconnect();
    });

    it('should set the `maxlength` attribute on the internal control equal to the value provided', async () => {
        const maxlength = 14;
        const { element, disconnect } = await setup({ maxlength });

        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.getAttribute('maxlength')
        ).toBe(maxlength.toString());

        await disconnect();
    });

    it('should set the `minlength` attribute on the internal control equal to the value provided', async () => {
        const minlength = 8;
        const { element, disconnect } = await setup({ minlength });

        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.getAttribute('minlength')
        ).toBe(minlength.toString());

        await disconnect();
    });

    it('should set the `placeholder` attribute on the internal control equal to the value provided', async () => {
        const placeholder = 'placeholder';
        const { element, disconnect } = await setup({ placeholder });

        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.getAttribute('placeholder')
        ).toBe(placeholder);

        await disconnect();
    });

    it('should set the `readonly` attribute on the internal control equal to the value provided', async () => {
        const { element, disconnect } = await setup({ readOnly: true });

        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('readonly')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `required` attribute on the internal control equal to the value provided', async () => {
        const { element, disconnect } = await setup({ required: true });

        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('required')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `size` attribute on the internal control equal to the value provided', async () => {
        const { element, disconnect } = await setup({ size: 8 });

        expect(
            element.shadowRoot!.querySelector('.control')?.hasAttribute('size')
        ).toBeTrue();

        await disconnect();
    });

    it('should initialize to the initial value if no value property is set', async () => {
        const { element, disconnect } = await setup();

        expect(element.value).toBe(element.initialValue);

        await disconnect();
    });

    it('should initialize to the provided value attribute if set pre-connection', async () => {
        const value = '10';
        const { element, disconnect } = await setup({ value });

        expect(element.value).toBe(value);

        await disconnect();
    });

    it('should initialize to the provided value attribute if set post-connection', async () => {
        const value = '10';
        const { element, disconnect } = await setup();

        element.setAttribute('value', value);

        expect(element.value).toBe(value);

        await disconnect();
    });

    it('should initialize to the provided value property if set pre-connection', async () => {
        const value = '10';
        const { element, disconnect } = await setup({ value });

        expect(element.value).toBe(value);

        await disconnect();
    });

    describe('Delegates ARIA textbox', () => {
        it('should set the `aria-atomic` attribute on the internal control when provided', async () => {
            const ariaAtomic = 'true';
            const { element, disconnect } = await setup({ ariaAtomic });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-atomic')
            ).toBe(ariaAtomic);

            await disconnect();
        });

        it('should set the `aria-busy` attribute on the internal control when provided', async () => {
            const ariaBusy = 'false';
            const { element, disconnect } = await setup({ ariaBusy });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-busy')
            ).toBe(ariaBusy);

            await disconnect();
        });

        it('should set the `aria-controls` attribute on the internal control when provided', async () => {
            const ariaControls = 'testId';
            const { element, disconnect } = await setup({ ariaControls });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-controls')
            ).toBe(ariaControls);

            await disconnect();
        });

        it('should set the `aria-current` attribute on the internal control when provided', async () => {
            const ariaCurrent = 'page';
            const { element, disconnect } = await setup({ ariaCurrent });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-current')
            ).toBe(ariaCurrent);

            await disconnect();
        });

        it('should set the `aria-describedby` attribute on the internal control when provided', async () => {
            const ariaDescribedby = 'testId';
            const { element, disconnect } = await setup({ ariaDescribedby });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-describedby')
            ).toBe(ariaDescribedby);

            await disconnect();
        });

        it('should set the `aria-details` attribute on the internal control when provided', async () => {
            const ariaDetails = 'testId';
            const { element, disconnect } = await setup({ ariaDetails });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-details')
            ).toBe(ariaDetails);

            await disconnect();
        });

        it('should set the `aria-disabled` attribute on the internal control when provided', async () => {
            const ariaDisabled = 'true';
            const { element, disconnect } = await setup({ ariaDisabled });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-disabled')
            ).toBe(ariaDisabled);

            await disconnect();
        });

        it('should set the `aria-errormessage` attribute on the internal control when provided', async () => {
            const ariaErrormessage = 'test';
            const { element, disconnect } = await setup({ ariaErrormessage });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-errormessage')
            ).toBe(ariaErrormessage);

            await disconnect();
        });

        it('should set the `aria-flowto` attribute on the internal control when provided', async () => {
            const ariaFlowto = 'testId';
            const { element, disconnect } = await setup({ ariaFlowto });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-flowto')
            ).toBe(ariaFlowto);

            await disconnect();
        });

        it('should set the `aria-haspopup` attribute on the internal control when provided', async () => {
            const ariaHaspopup = 'true';
            const { element, disconnect } = await setup({ ariaHaspopup });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-haspopup')
            ).toBe(ariaHaspopup);

            await disconnect();
        });

        it('should set the `aria-hidden` attribute on the internal control when provided', async () => {
            const ariaHidden = 'true';
            const { element, disconnect } = await setup({ ariaHidden });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-hidden')
            ).toBe(ariaHidden);

            await disconnect();
        });

        it('should set the `aria-invalid` attribute on the internal control when provided', async () => {
            const ariaInvalid = 'spelling';
            const { element, disconnect } = await setup({ ariaInvalid });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-invalid')
            ).toBe(ariaInvalid);

            await disconnect();
        });

        it('should set the `aria-keyshortcuts` attribute on the internal control when provided', async () => {
            const ariaKeyshortcuts = 'F4';
            const { element, disconnect } = await setup({ ariaKeyshortcuts });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-keyshortcuts')
            ).toBe(ariaKeyshortcuts);

            await disconnect();
        });

        it('should set the `aria-label` attribute on the internal control when provided', async () => {
            const ariaLabel = 'Foo label';
            const { element, disconnect } = await setup({ ariaLabel });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-label')
            ).toBe(ariaLabel);

            await disconnect();
        });

        it('should set the `aria-labelledby` attribute on the internal control when provided', async () => {
            const ariaLabelledby = 'testId';
            const { element, disconnect } = await setup({ ariaLabelledby });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-labelledby')
            ).toBe(ariaLabelledby);

            await disconnect();
        });

        it('should set the `aria-live` attribute on the internal control when provided', async () => {
            const ariaLive = 'polite';
            const { element, disconnect } = await setup({ ariaLive });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-live')
            ).toBe(ariaLive);

            await disconnect();
        });

        it('should set the `aria-owns` attribute on the internal control when provided', async () => {
            const ariaOwns = 'testId';
            const { element, disconnect } = await setup({ ariaOwns });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-owns')
            ).toBe(ariaOwns);

            await disconnect();
        });

        it('should set the `aria-relevant` attribute on the internal control when provided', async () => {
            const ariaRelevant = 'removals';
            const { element, disconnect } = await setup({ ariaRelevant });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-relevant')
            ).toBe(ariaRelevant);

            await disconnect();
        });

        it('should set the `aria-roledescription` attribute on the internal control when provided', async () => {
            const ariaRoledescription = 'slide';
            const { element, disconnect } = await setup({
                ariaRoledescription
            });

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-roledescription')
            ).toBe(ariaRoledescription);

            await disconnect();
        });
    });

    describe('events', () => {
        it('should fire a change event when the internal control emits a change event', async () => {
            const { element, disconnect } = await setup();
            const event = new Event('change', {
                key: '1'
            } as KeyboardEventInit);
            let wasChanged = false;

            element.addEventListener('change', e => {
                e.preventDefault();

                wasChanged = true;
            });

            const textarea = element.shadowRoot!.querySelector('input');
            textarea?.dispatchEvent(event);

            expect(wasChanged).toBeTrue();

            await disconnect();
        });

        it('should fire an input event when incrementing or decrementing', async () => {
            const { element, disconnect } = await setup();
            let wasInput = false;

            element.addEventListener('input', e => {
                e.preventDefault();

                wasInput = true;
            });

            element.stepUp();

            expect(wasInput).toBeTrue();

            wasInput = false;

            element.stepDown();

            expect(wasInput).toBeTrue();

            await disconnect();
        });
    });

    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", async () => {
            const { element, disconnect, parent } = await setup();

            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);

            const value = '10';
            element.value = value;
            expect(element.value).toBe(value);

            form.reset();

            expect(element.value).toBe('');

            await disconnect();
        });

        it("should reset it's value property to the value of the value attribute if it is set", async () => {
            const { element, disconnect, parent } = await setup();

            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);

            element.setAttribute('value', '10');

            element.value = '20';
            expect(element.getAttribute('value')).toBe('10');
            expect(element.value).toBe('20');

            form.reset();
            expect(element.value).toBe('10');

            await disconnect();
        });

        it('should update input field when script sets value', async () => {
            const { element, disconnect } = await setup();
            const value = '10';

            expect(
                element.shadowRoot!.querySelector<HTMLInputElement>('.control')!
                    .value
            ).toBe('');

            element.setAttribute('value', value);

            await DOM.nextUpdate();

            expect(
                element.shadowRoot!.querySelector<HTMLInputElement>('.control')!
                    .value
            ).toBe(value);

            await disconnect();
        });

        it('should put the control into a clean state, where value attribute changes the property value prior to user or programmatic interaction', async () => {
            const { element, disconnect, parent } = await setup();
            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);
            element.setAttribute('value', '10');

            element.value = '20';
            expect(element.value).toBe('20');

            form.reset();

            expect(element.value).toBe('10');

            element.setAttribute('value', '30');
            expect(element.value).toBe('30');

            await disconnect();
        });
    });

    describe('min and max values', () => {
        it('should set min value', async () => {
            const min = 1;
            const { element, disconnect } = await setup({ min });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('min')
            ).toBe(min.toString());

            await disconnect();
        });

        it('should set max value', async () => {
            const max = 10;
            const { element, disconnect } = await setup({ max });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('max')
            ).toBe(max.toString());

            await disconnect();
        });

        it('should set value to max when value is greater than max', async () => {
            const max = 10;
            const value = '20';
            const { element, disconnect } = await setup({ value, max });

            expect(element.value).toBe(max.toString());

            await disconnect();
        });

        it('should set value to max if the max changes to a value less than the value', async () => {
            const max = 10;
            const value = `${10 + max}`;
            const { element, disconnect } = await setup({ value });

            expect(element.value).toBe(value.toString());

            element.setAttribute('max', max.toString());
            await DOM.nextUpdate();

            expect(element.value).toBe(max.toString());

            await disconnect();
        });

        it('should set value to min when value is less than min', async () => {
            const min = 10;
            const value = `${min - 8}`;
            const { element, disconnect } = await setup({ value, min });

            expect(element.value).toBe(min.toString());

            element.value = `${min - 100}`;
            await DOM.nextUpdate();

            expect(element.value).toBe(min.toString());
            await disconnect();
        });

        it('should set value to min if the min changes to a value more than the value', async () => {
            const min = 20;
            const value = `${min - 10}`;
            const { element, disconnect } = await setup({ value });

            expect(element.value).toBe(value.toString());

            element.setAttribute('min', min.toString());
            await DOM.nextUpdate();

            expect(element.value).toBe(min.toString());

            await disconnect();
        });

        it('should set max to highest when min is greater than max', async () => {
            const min = 10;
            const max = 1;
            const { element, disconnect } = await setup({ min, max });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('max')
            ).toBe(min.toString());

            await disconnect();
        });
    });

    describe('step and increment/decrement', () => {
        it('should set step to a default of 1', async () => {
            const { element, disconnect } = await setup();

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('step')
            ).toBe('1');

            await disconnect();
        });

        it('should update step', async () => {
            const step = 2;
            const { element, disconnect } = await setup({ step });

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('step')
            ).toBe(step.toString());

            await disconnect();
        });

        it('should increment the value by the step amount', async () => {
            const step = 2;
            const value = 5;
            const { element, disconnect } = await setup({
                step,
                value: value.toString()
            });

            element.stepUp();

            expect(element.value).toBe(`${value + step}`);

            await disconnect();
        });

        it('should decrement the value by the step amount', async () => {
            const step = 2;
            const value = 5;
            const { element, disconnect } = await setup({
                step,
                value: value.toString()
            });

            element.stepDown();

            expect(element.value).toBe(`${value - step}`);

            await disconnect();
        });

        it('should increment no value to the step amount', async () => {
            const step = 2;
            const { element, disconnect } = await setup({ step });

            element.stepUp();

            expect(element.value).toBe(`${step}`);

            await disconnect();
        });

        it('should decrement no value to the negative step amount', async () => {
            const step = 2;
            const { element, disconnect } = await setup({ step });

            element.stepDown();
            await DOM.nextUpdate();

            expect(element.value).toBe(`${0 - step}`);

            await disconnect();
        });

        it('should decrement to zero when no value and negative min', async () => {
            const min = -10;
            const { element, disconnect } = await setup({ min });

            element.stepDown();
            await DOM.nextUpdate();

            expect(element.value).toBe('0');

            await disconnect();
        });

        it('should increment to zero when no value and negative min', async () => {
            const min = -10;
            const { element, disconnect } = await setup({ min });

            element.stepUp();
            await DOM.nextUpdate();

            expect(element.value).toBe('0');

            await disconnect();
        });

        it('should decrement to min when no value and min > 0', async () => {
            const min = 10;
            const { element, disconnect } = await setup({ min });

            element.stepDown();
            await DOM.nextUpdate();

            expect(element.value).toBe(min.toString());

            await disconnect();
        });

        it('should increment to min when no value and min > 0', async () => {
            const min = 10;
            const { element, disconnect } = await setup({ min });

            element.stepUp();
            await DOM.nextUpdate();

            expect(element.value).toBe(min.toString());

            await disconnect();
        });

        it('should decrement to max when no value and min and max < 0', async () => {
            const min = -100;
            const max = -10;
            const { element, disconnect } = await setup({ min, max });

            element.stepDown();
            await DOM.nextUpdate();

            expect(element.value).toBe(max.toString());

            await disconnect();
        });

        it('should increment to mx when no value and min and max < 0', async () => {
            const min = -100;
            const max = -10;
            const { element, disconnect } = await setup({ min, max });

            element.stepUp();
            await DOM.nextUpdate();

            expect(element.value).toBe(max.toString());

            await disconnect();
        });

        it('should update the proxy value when incrementing the value', async () => {
            const step = 2;
            const value = 5;
            const { element, disconnect } = await setup({
                step,
                value: value.toString()
            });

            element.stepUp();

            expect(element.value).toBe(`${value + step}`);
            expect(element.proxy.value).toBe(`${value + step}`);

            await disconnect();
        });

        it('should update the proxy value when decrementing the value', async () => {
            const step = 2;
            const value = 5;
            const { element, disconnect } = await setup({
                step,
                value: value.toString()
            });

            element.stepDown();

            expect(element.value).toBe(`${value - step}`);
            expect(element.proxy.value).toBe(`${value - step}`);

            await disconnect();
        });

        it('should correct rounding errors', async () => {
            const step = 0.1;
            let value = (0.2).toString();
            const { element, disconnect } = await setup({ step, value });
            const incrementValue = (): void => {
                element.stepUp();
                value = (parseFloat(value) + step).toPrecision(1);
            };

            expect(element.value).toBe(value);

            incrementValue();
            expect(element.value).toBe(value);

            incrementValue();
            expect(element.value).toBe(value);

            incrementValue();
            expect(element.value).toBe(value);

            incrementValue();
            expect(element.value).toBe(value);

            await disconnect();
        });
    });

    describe('value validation', () => {
        it('should allow number entry', async () => {
            const value = '18';
            const { element, disconnect } = await setup();

            element.setAttribute('value', value);

            expect(element.value).toBe(value);

            await disconnect();
        });

        it('should not allow non-number entry', async () => {
            const { element, disconnect } = await setup();

            element.setAttribute('value', '11a');
            expect(element.value).toBe('11');

            await disconnect();
        });

        it('should allow float number entry', async () => {
            const { element, disconnect } = await setup();
            const floatValue = '37.5';

            element.setAttribute('value', floatValue);
            expect(element.value).toBe(floatValue);

            await disconnect();
        });

        it('should allow negative number entry', async () => {
            const { element, disconnect } = await setup();

            element.setAttribute('value', '-1');
            expect(element.value).toBe('-1');

            await disconnect();
        });

        it('should allow negative float entry', async () => {
            const { element, disconnect } = await setup();
            const negativeFloatValue = '-1.5';

            element.setAttribute('value', negativeFloatValue);
            expect(element.value).toBe(negativeFloatValue);

            await disconnect();
        });
    });

    describe('hide step', () => {
        it('should not render step controls when `hide-step` attribute is present', async () => {
            const { element, disconnect } = await setup();

            expect(element.shadowRoot!.querySelector('.controls')).not.toBe(
                null
            );

            element.setAttribute('hide-step', '');

            await DOM.nextUpdate();

            expect(element.shadowRoot!.querySelector('.controls')).toBe(null);

            await disconnect();
        });
    });

    describe('readonly', () => {
        it('should not render step controls when `readonly` attribute is present', async () => {
            const { element, disconnect } = await setup();

            expect(element.shadowRoot!.querySelector('.controls')).not.toBe(
                null
            );

            element.setAttribute('readonly', '');

            await DOM.nextUpdate();

            expect(element.shadowRoot!.querySelector('.controls')).toBe(null);

            await disconnect();
        });
    });

    describe('valueAsNumber', () => {
        it('should allow setting value with number', async () => {
            const { element, disconnect } = await setup();

            element.valueAsNumber = 18;

            expect(element.value).toBe('18');

            await disconnect();
        });

        it('should allow reading value as number', async () => {
            const { element, disconnect } = await setup();

            element.value = '18';

            expect(element.valueAsNumber).toBe(18);

            await disconnect();
        });
    });
});
