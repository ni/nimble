import { html } from '@microsoft/fast-element';
import { Anchor, anchorTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { parameterizeNamedList } from '../../utilities/tests/parameterized';

async function setup(): Promise<Fixture<Anchor>> {
    return fixture<Anchor>(html`<nimble-anchor></nimble-anchor>`);
}

describe('Anchor', () => {
    let element: Anchor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(anchorTag).toBe('nimble-anchor');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchor')).toBeInstanceOf(Anchor);
    });

    it('should set the "control" class on the internal control', async () => {
        await connect();
        expect(element.control!.classList.contains('control')).toBe(true);
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(element.control!.part.contains('control')).toBe(true);
    });

    const attributeNames: { name: string }[] = [
        { name: 'download' },
        { name: 'href' },
        { name: 'hreflang' },
        { name: 'ping' },
        { name: 'referrerpolicy' },
        { name: 'rel' },
        { name: 'target' },
        { name: 'type' },
        { name: 'aria-atomic' },
        { name: 'aria-busy' },
        { name: 'aria-controls' },
        { name: 'aria-current' },
        { name: 'aria-describedby' },
        { name: 'aria-details' },
        { name: 'aria-disabled' },
        { name: 'aria-errormessage' },
        { name: 'aria-expanded' },
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
        parameterizeNamedList(attributeNames, (spec, name) => {
            spec(`for attribute ${name}`, async () => {
                await connect();

                element.setAttribute(name, 'foo');
                await waitForUpdatesAsync();

                expect(element.control!.getAttribute(name)).toBe('foo');
            });
        });
    });

    describe('contenteditable behavior', () => {
        let innerAnchor: HTMLAnchorElement;

        beforeEach(async () => {
            await connect();
            innerAnchor = element.shadowRoot!.querySelector('a')!;
        });

        it('has undefined property value and inner anchor isContentEditable is false by default', () => {
            expect(element.contentEditable).toBeUndefined();
            expect(innerAnchor.isContentEditable).toBeFalse();
        });

        const interestingValues = [
            { name: '', expected: true, skipTag: '' },
            { name: 'true', expected: true, skipTag: '' },
            { name: 'false', expected: false, skipTag: '' },
            { name: 'plaintext-only', expected: true, skipTag: '#SkipFirefox' },
            { name: 'inherit', expected: false, skipTag: '' },
            { name: 'badvalue', expected: false, skipTag: '' }
        ] as const;

        parameterizeNamedList(interestingValues, (spec, name, value) => {
            spec(
                `inner anchor isContentEditable is ${value.expected.toString()} when attribute set to "${name}" ${
                    value.skipTag
                }`,
                async () => {
                    element.setAttribute('contenteditable', name);
                    await waitForUpdatesAsync();
                    expect(innerAnchor.isContentEditable).toEqual(
                        value.expected
                    );
                }
            );
        });

        parameterizeNamedList(interestingValues, (spec, name, value) => {
            spec(
                `inner anchor isContentEditable is ${value.expected.toString()} when property set to "${name}" ${
                    value.skipTag
                }`,
                async () => {
                    element.contentEditable = name;
                    await waitForUpdatesAsync();
                    expect(innerAnchor.isContentEditable).toEqual(
                        value.expected
                    );
                }
            );
        });
    });

    describe('with contenteditable without value', () => {
        async function setupWithContenteditable(): Promise<Fixture<Anchor>> {
            return fixture<Anchor>(
                html`<nimble-anchor contenteditable></nimble-anchor>`
            );
        }

        it('acts like value is "true"', async () => {
            ({ element, connect, disconnect } = await setupWithContenteditable());
            await connect();
            const innerAnchor = element.shadowRoot!.querySelector('a')!;
            expect(innerAnchor.isContentEditable).toBeTrue();
        });
    });
});
