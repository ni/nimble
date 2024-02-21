import { html } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { TextArea, textAreaTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<TextArea>> {
    return fixture<TextArea>(html`<nimble-text-area></nimble-text-area>`);
}

describe('Text Area', () => {
    let element: TextArea;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(textAreaTag).toBe('nimble-text-area');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-text-area')).toBeInstanceOf(
            TextArea
        );
    });

    it('should set the "control" class on the internal control', async () => {
        await connect();
        expect(element.control.classList.contains('control')).toBe(true);
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(element.control.part.contains('control')).toBe(true);
    });

    const attributeNames: readonly {
        name: string,
        value?: string,
        boolean?: boolean
    }[] = [
        { name: 'autofocus', boolean: true },
        { name: 'cols', value: '10' },
        { name: 'disabled', boolean: true },
        { name: 'list' },
        { name: 'maxlength', value: '10' },
        { name: 'minlength', value: '10' },
        { name: 'name' },
        { name: 'placeholder' },
        { name: 'readonly', boolean: true },
        { name: 'required', boolean: true },
        { name: 'rows', value: '10' },
        { name: 'spellcheck', boolean: true },
        { name: 'aria-atomic' },
        { name: 'aria-busy' },
        { name: 'aria-controls' },
        { name: 'aria-current' },
        { name: 'aria-describedby' },
        { name: 'aria-details' },
        { name: 'aria-disabled' },
        { name: 'aria-errormessage' },
        { name: 'aria-flowto' },
        { name: 'aria-haspopup' },
        { name: 'aria-hidden' },
        { name: 'aria-invalid' },
        { name: 'aria-keyshortcuts' },
        { name: 'aria-label' },
        { name: 'aria-labelledby' },
        { name: 'aria-live' },
        { name: 'aria-owns' },
        { name: 'aria-relevant' },
        { name: 'aria-roledescription' }
    ] as const;
    describe('should reflect value to the internal control', () => {
        parameterizeSpec(attributeNames, (spec, name, value) => {
            spec(`for attribute ${name}`, async () => {
                await connect();

                element.setAttribute(
                    value.name,
                    value.value ?? (value.boolean ? '' : 'foo')
                );
                await waitForUpdatesAsync();

                if (value.boolean) {
                    expect(element.control.hasAttribute(value.name)).toBeTrue();
                } else {
                    expect(element.control.getAttribute(value.name)).toBe(
                        value.value ?? 'foo'
                    );
                }
            });
        });

        it('for property value', async () => {
            await connect();

            element.value = 'foo';
            await waitForUpdatesAsync();

            expect(element.control.value).toBe('foo');
        });
    });
});
