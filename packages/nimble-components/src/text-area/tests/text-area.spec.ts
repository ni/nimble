import { html } from '@microsoft/fast-element';
import { TextArea, textAreaTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

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

    const attributeNames: {
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
    ];
    describe('should reflect value to the internal control', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const attribute of attributeNames) {
            const specType = getSpecTypeByNamedList(
                attribute,
                focused,
                disabled
            );
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`for attribute ${attribute.name}`, async () => {
                await connect();

                element.setAttribute(
                    attribute.name,
                    attribute.value ?? (attribute.boolean ? '' : 'foo')
                );
                await waitForUpdatesAsync();

                if (attribute.boolean) {
                    expect(
                        element.control.hasAttribute(attribute.name)
                    ).toBeTrue();
                } else {
                    expect(element.control.getAttribute(attribute.name)).toBe(
                        attribute.value ?? 'foo'
                    );
                }
            });
        }

        it('for property value', async () => {
            await connect();

            element.value = 'foo';
            await waitForUpdatesAsync();

            expect(element.control.value).toBe('foo');
        });
    });
});
