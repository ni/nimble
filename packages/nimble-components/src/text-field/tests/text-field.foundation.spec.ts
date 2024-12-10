import { TextFieldType } from '@microsoft/fast-foundation';
import { TextField } from '..';
import { fixture } from '../../utilities/tests/fixture';
import { template } from '../template';

// eslint-disable-next-line @typescript-eslint/naming-convention
const FASTTextField = TextField.compose({
    baseName: 'text-field',
    template
});

async function setup(): Promise<{
    element: TextField,
    connect: () => Promise<void>,
    disconnect: () => Promise<void>,
    parent: HTMLElement
}> {
    const { element, connect, disconnect, parent } = await fixture(FASTTextField());

    return { element, connect, disconnect, parent };
}

describe('TextField', () => {
    it('should set the `autofocus` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const autofocus = true;

        element.autofocus = autofocus;

        await connect();
        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('autofocus')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `disabled` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const disabled = true;

        element.disabled = disabled;

        await connect();
        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('disabled')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `list` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const list = 'listId';

        element.list = list;

        await connect();
        expect(
            element.shadowRoot!.querySelector('.control')?.getAttribute('list')
        ).toEqual(list);

        await disconnect();
    });

    it('should set the `maxlength` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const maxlength = 14;

        element.maxlength = maxlength;

        await connect();
        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.getAttribute('maxlength')
        ).toEqual(maxlength.toString());

        await disconnect();
    });

    it('should set the `minlength` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const minlength = 8;

        element.minlength = minlength;

        await connect();
        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.getAttribute('minlength')
        ).toEqual(minlength.toString());

        await disconnect();
    });

    it('should set the `placeholder` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const placeholder = 'placeholder';

        element.placeholder = placeholder;

        await connect();
        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.getAttribute('placeholder')
        ).toEqual(placeholder);

        await disconnect();
    });

    it('should set the `readonly` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const readonly = true;

        element.readOnly = readonly;

        await connect();
        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('readonly')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `required` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const required = true;

        element.required = required;

        await connect();
        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('required')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `size` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const size = 8;

        element.size = size;

        await connect();
        expect(
            element.shadowRoot!.querySelector('.control')?.hasAttribute('size')
        ).toBeTrue();

        await disconnect();
    });

    it('should set the `spellcheck` attribute on the internal control equal to the value provided', async () => {
        const { element, connect, disconnect } = await setup();
        const spellcheck = true;

        element.spellcheck = spellcheck;

        await connect();
        expect(
            element
                .shadowRoot!.querySelector('.control')
                ?.hasAttribute('spellcheck')
        ).toBeTrue();

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
    it('should hide the label when start content is provided', async () => {
        const { element, connect, disconnect } = await setup();
        const div: HTMLDivElement = document.createElement(
            'svg'
        ) as HTMLDivElement;
        div.setAttribute('height', '100px');
        div.setAttribute('width', '100px');

        await connect();
        div.slot = 'start';
        element.appendChild(div);

        expect(
            element.shadowRoot
                ?.querySelector('label')
                ?.classList.contains('label__hidden')
        ).toBeTrue();

        await disconnect();
    });

    it('should hide the label when end content is provided', async () => {
        const { element, connect, disconnect } = await setup();
        const div: HTMLDivElement = document.createElement(
            'svg'
        ) as HTMLDivElement;
        div.setAttribute('height', '100px');
        div.setAttribute('width', '100px');

        await connect();
        div.slot = 'end';
        element.appendChild(div);

        expect(
            element.shadowRoot
                ?.querySelector('label')
                ?.classList.contains('label__hidden')
        ).toBeTrue();

        await disconnect();
    });
    it('should hide the label when start and end content are provided', async () => {
        const { element, connect, disconnect } = await setup();
        const div: HTMLDivElement = document.createElement(
            'svg'
        ) as HTMLDivElement;
        div.setAttribute('height', '100px');
        div.setAttribute('width', '100px');

        const div2: HTMLDivElement = div;

        await connect();
        div.slot = 'start';
        div2.slot = 'end';

        element.appendChild(div);
        element.appendChild(div2);

        expect(
            element.shadowRoot
                ?.querySelector('label')
                ?.classList.contains('label__hidden')
        ).toBeTrue();

        await disconnect();
    });
    it('should hide the label when whitespace only text nodes are slotted', async () => {
        const { element, connect, disconnect } = await setup();
        const whitespace: Node = document.createTextNode(' ') as Node;
        const whitespace2: Node = document.createTextNode(' \r ') as Node;

        await connect();

        element.appendChild(whitespace);
        element.appendChild(whitespace2);

        expect(
            element.shadowRoot
                ?.querySelector('label')
                ?.classList.contains('label__hidden')
        ).toBeTrue();

        await disconnect();
    });

    it('should hide the label when no default slotted content is provided', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('label')
                ?.classList.contains('label__hidden')
        ).toBeTrue();

        await disconnect();
    });

    describe('Delegates ARIA textbox', () => {
        it('should set the `aria-atomic` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaAtomic = 'true';

            element.ariaAtomic = ariaAtomic;

            await connect();

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-atomic')
            ).toEqual(ariaAtomic);

            await disconnect();
        });

        it('should set the `aria-busy` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaBusy = 'false';

            element.ariaBusy = ariaBusy;

            await connect();

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-busy')
            ).toEqual(ariaBusy);

            await disconnect();
        });

        it('should set the `aria-controls` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaControls = 'testId';

            element.ariaControls = ariaControls;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-controls')
            ).toEqual(ariaControls);

            await disconnect();
        });

        it('should set the `aria-current` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaCurrent = 'page';

            element.ariaCurrent = ariaCurrent;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-current')
            ).toEqual(ariaCurrent);

            await disconnect();
        });

        it('should set the `aria-describedby` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDescribedby = 'testId';

            element.ariaDescribedby = ariaDescribedby;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-describedby')
            ).toEqual(ariaDescribedby);

            await disconnect();
        });

        it('should set the `aria-details` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDetails = 'testId';

            element.ariaDetails = ariaDetails;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-details')
            ).toEqual(ariaDetails);

            await disconnect();
        });

        it('should set the `aria-disabled` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDisabled = 'true';

            element.ariaDisabled = ariaDisabled;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-disabled')
            ).toEqual(ariaDisabled);

            await disconnect();
        });

        it('should set the `aria-errormessage` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaErrormessage = 'test';

            element.ariaErrormessage = ariaErrormessage;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-errormessage')
            ).toEqual(ariaErrormessage);

            await disconnect();
        });

        it('should set the `aria-flowto` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaFlowto = 'testId';

            element.ariaFlowto = ariaFlowto;

            await connect();

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-flowto')
            ).toEqual(ariaFlowto);

            await disconnect();
        });

        it('should set the `aria-haspopup` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHaspopup = 'true';

            element.ariaHaspopup = ariaHaspopup;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-haspopup')
            ).toEqual(ariaHaspopup);

            await disconnect();
        });

        it('should set the `aria-hidden` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHidden = 'true';

            element.ariaHidden = ariaHidden;

            await connect();

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-hidden')
            ).toEqual(ariaHidden);

            await disconnect();
        });

        it('should set the `aria-invalid` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaInvalid = 'spelling';

            element.ariaInvalid = ariaInvalid;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-invalid')
            ).toEqual(ariaInvalid);

            await disconnect();
        });

        it('should set the `aria-keyshortcuts` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaKeyshortcuts = 'F4';

            element.ariaKeyshortcuts = ariaKeyshortcuts;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-keyshortcuts')
            ).toEqual(ariaKeyshortcuts);

            await disconnect();
        });

        it('should set the `aria-label` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabel = 'Foo label';

            element.ariaLabel = ariaLabel;

            await connect();

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-label')
            ).toEqual(ariaLabel);

            await disconnect();
        });

        it('should set the `aria-labelledby` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabelledby = 'testId';

            element.ariaLabelledby = ariaLabelledby;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-labelledby')
            ).toEqual(ariaLabelledby);

            await disconnect();
        });

        it('should set the `aria-live` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLive = 'polite';

            element.ariaLive = ariaLive;

            await connect();

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-live')
            ).toEqual(ariaLive);

            await disconnect();
        });

        it('should set the `aria-owns` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaOwns = 'testId';

            element.ariaOwns = ariaOwns;

            await connect();

            expect(
                element
                    .shadowRoot!.querySelector('.control')
                    ?.getAttribute('aria-owns')
            ).toEqual(ariaOwns);

            await disconnect();
        });

        it('should set the `aria-relevant` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRelevant = 'removals';

            element.ariaRelevant = ariaRelevant;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-relevant')
            ).toEqual(ariaRelevant);

            await disconnect();
        });

        it('should set the `aria-roledescription` attribute on the internal control when provided', async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRoledescription = 'slide';

            element.ariaRoledescription = ariaRoledescription;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector('.control')
                    ?.getAttribute('aria-roledescription')
            ).toEqual(ariaRoledescription);

            await disconnect();
        });
    });

    describe('events', () => {
        it('should fire a change event the internal control emits a change event', async () => {
            const { element, connect, disconnect } = await setup();
            const event = new Event('change', {
                key: 'a'
            } as KeyboardEventInit);
            let wasChanged = false;

            await connect();

            element.addEventListener('change', e => {
                e.preventDefault();

                wasChanged = true;
            });

            const textarea = element.shadowRoot!.querySelector('input');
            textarea?.dispatchEvent(event);

            expect(wasChanged).toBeTrue();

            await disconnect();
        });
    });

    describe('with constraint validation', () => {
        Object.keys(TextFieldType)
            .map(
                (key): TextFieldType => TextFieldType[key as keyof typeof TextFieldType]
            )
            .forEach(type => {
                describe(`of [type="${type}"]`, () => {
                    describe('that is [required]', () => {
                        it("should be invalid when it's value property is an empty string", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();

                            element.type = type;
                            element.required = true;
                            element.value = '';

                            expect(element.validity.valueMissing).toBeTrue();

                            await disconnect();
                        });

                        it('should be valid when value property is a string that is non-empty', async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();

                            element.type = type;

                            element.required = true;
                            element.value = 'some value';

                            expect(element.validity.valueMissing).toBeFalse();
                            await disconnect();
                        });
                    });
                    describe('that has a [minlength] attribute', () => {
                        it('should be valid if the value is an empty string', async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = '';
                            element.type = type;
                            element.value = value;
                            element.minlength = value.length + 1;

                            expect(element.validity.tooShort).toBeFalse();
                            await disconnect();
                        });
                        it('should be valid if the value has a length less than the minlength', async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = 'value';
                            element.type = type;
                            element.value = value;
                            element.minlength = value.length + 1;

                            expect(element.validity.tooShort).toBeFalse();
                            await disconnect();
                        });
                    });

                    describe('that has a [maxlength] attribute', () => {
                        it('should be valid if the value is an empty string', async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();

                            const value = '';
                            element.type = type;
                            element.value = value;
                            element.maxlength = value.length;

                            expect(element.validity.tooLong).toBeFalse();

                            await disconnect();
                        });
                        it('should be valid if the value has a exceeding the maxlength', async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = 'value';
                            element.type = type;
                            element.value = value;
                            element.maxlength = value.length - 1;

                            expect(element.validity.tooLong).toBeFalse();
                            await disconnect();
                        });
                        it('should be valid if the value has a length shorter than maxlength and the element is [required]', async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = 'value';
                            element.type = type;
                            element.required = true;
                            element.value = value;
                            element.maxlength = value.length + 1;

                            expect(element.validity.tooLong).toBeFalse();
                            await disconnect();
                        });
                    });

                    describe('that has a [pattern] attribute', () => {
                        it('should be valid if the value matches a pattern', async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = 'value';
                            element.type = type;
                            element.required = true;
                            element.pattern = value;
                            element.value = value;

                            expect(
                                element.validity.patternMismatch
                            ).toBeFalse();
                            await disconnect();
                        });

                        it('should be invalid if the value does not match a pattern', async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = 'value';
                            element.type = type;
                            element.required = true;
                            element.pattern = value;
                            element.value = 'foo';

                            expect(element.validity.patternMismatch).toBeTrue();
                            await disconnect();
                        });
                    });
                });
            });
        describe('of [type="email"]', () => {
            it('should be valid when value is an empty string', async () => {
                const { element, connect, disconnect } = await setup();
                await connect();
                element.type = TextFieldType.email;
                element.required = true;
                element.value = '';

                expect(element.validity.typeMismatch).toBeFalse();

                await disconnect();
            });
            it('should be a typeMismatch when value is not a valid email', async () => {
                const { element, connect, disconnect } = await setup();
                await connect();
                element.type = TextFieldType.email;
                element.required = true;
                element.value = 'foobar';

                expect(element.validity.typeMismatch).toBeTrue();

                await disconnect();
            });
        });
        describe('of [type="url"]', () => {
            it('should be valid when value is an empty string', async () => {
                const { element, connect, disconnect } = await setup();
                await connect();
                element.type = TextFieldType.url;
                element.required = true;
                element.value = '';

                expect(element.validity.typeMismatch).toBeFalse();

                await disconnect();
            });
            it('should be a typeMismatch when value is not a valid URL', async () => {
                const { element, connect, disconnect } = await setup();
                await connect();
                element.type = TextFieldType.url;
                element.required = true;
                element.value = 'foobar';

                expect(element.validity.typeMismatch).toBeTrue();

                await disconnect();
            });
        });
    });

    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", async () => {
            const { element, connect, disconnect, parent } = await setup();

            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.value = 'test-value';

            expect(element.getAttribute('value')).toBeNull();
            expect(element.value).toBe('test-value');

            form.reset();

            expect(element.value).toBe('');

            await disconnect();
        });

        it("should reset it's value property to the value of the value attribute if it is set", async () => {
            const { element, connect, disconnect, parent } = await setup();

            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);
            await connect();

            element.setAttribute('value', 'attr-value');

            element.value = 'test-value';

            expect(element.getAttribute('value')).toEqual('attr-value');

            expect(element.value).toEqual('test-value');

            form.reset();

            expect(element.value).toEqual('attr-value');

            await disconnect();
        });

        it('should put the control into a clean state, where value attribute changes change the property value prior to user or programmatic interaction', async () => {
            const { element, connect, disconnect, parent } = await setup();
            const form = document.createElement('form');
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.value = 'test-value';
            element.setAttribute('value', 'attr-value');

            expect(element.value).toEqual('test-value');

            form.reset();

            expect(element.value).toEqual('attr-value');

            element.setAttribute('value', 'new-attr-value');

            expect(element.value).toEqual('new-attr-value');
            await disconnect();
        });
    });
});
