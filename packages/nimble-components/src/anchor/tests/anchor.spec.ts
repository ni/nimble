import { html } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { Anchor, anchorTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<Anchor>> {
    return await fixture<Anchor>(html`<${anchorTag}></${anchorTag}>`);
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

    it('can construct an element instance', () => {
        expect(document.createElement(anchorTag)).toBeInstanceOf(Anchor);
    });

    it('should set the "control" class on the internal control', async () => {
        await connect();
        expect(element.control!.classList.contains('control')).toBe(true);
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(element.control!.part.contains('control')).toBe(true);
    });

    const attributeNames = [
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
    ] as const;
    describe('should reflect value to the internal control', () => {
        parameterizeSpec(attributeNames, (spec, name) => {
            spec(`for attribute ${name}`, async () => {
                await connect();

                element.setAttribute(name, 'foo');
                await waitForUpdatesAsync();

                expect(element.control!.getAttribute(name)).toBe('foo');
            });
        });

        it('for attribute tabindex', async () => {
            await connect();

            element.setAttribute('tabindex', '-1');
            await waitForUpdatesAsync();

            expect(element.control!.getAttribute('tabindex')).toBe('-1');
        });
    });

    it('should clear tabindex attribute from the internal control when cleared from the host', async () => {
        element.setAttribute('tabindex', '-1');
        await connect();

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        expect(element.control!.hasAttribute('tabindex')).toBeFalse();
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

        parameterizeSpec(interestingValues, (spec, name, value) => {
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

        parameterizeSpec(interestingValues, (spec, name, value) => {
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
            return await fixture<Anchor>(
                html`<${anchorTag} contenteditable></${anchorTag}>`
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
